import { RouterStateSnapshot, ActivatedRoute, Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { element } from 'protractor';
import { TranslateService } from 'ng2-translate';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MasonryOptions } from "angular2-masonry";

import { TasksService } from 'app/tasks/tasks.service';
import { Tasks } from 'app/tasks/tasks';
import { Filters } from 'app/shared/constants/filters.constant';

declare var Materialize: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  private idRemove;
  private $gridItems;

  modalActions: EventEmitter<string | MaterializeAction>;

  taskForm: FormGroup;
  tasks: Array<Tasks>;
  paramsFilter: Array<any>;
  filterSelected: string;
  iptTerm: string;
  noDataMessage: any;

  constructor(private _tasksService: TasksService, private _translateService: TranslateService, private _router: Router, private _route: ActivatedRoute) {
    this.tasks = new Array();
    this.modalActions = new EventEmitter<string | MaterializeAction>();
  }

  public myOptions: MasonryOptions = {
    // transitionDuration: '0.5s'
    originLeft: true,
    resize: true
  };

  ngOnInit() {
    // parametros do dropdown de filtros
    this.paramsFilter = [{
      constrainWidth: false,
      alignment: 'right',
      belowOrigin: true
    }];

    /**
     * Obtendo os parametros da url, para realiza as filtragens
     */
    this._route.params.subscribe(params => {
      this.filterSelected = params['p'];
      this.listTasks();
    });
  }

  /**
   * Listas as taks do usuário.
   * 
   * @memberOf TasksComponent
   */
  listTasks() {
    this._tasksService.listFilter(this.filterSelected).subscribe((res) => {
      if (res.length > 0) {
        this.tasks = res.map(item => { return new Tasks(item, this._translateService) });
      } else {
        this.tasks = [];
        // Exibir mensagem de não possui tasks cadastradas
        this.buildNoDateMessage();
      }
    }, (error) => {
      Materialize.toast(error, 5000);
    });
  }

  /**
   * Carrega as mensagens personalizadas quando não encontrar tarefas para serem listadas.
   * 
   * @memberOf TasksComponent
   */
  buildNoDateMessage(): void {
    this.noDataMessage = {}
    switch (this.filterSelected) {
      case Filters.TODAY: {
        this.noDataMessage.title = this._translateService.instant('NO-DATA.TITLE-TODAY');
        this.noDataMessage.content = this._translateService.instant('NO-DATA.CONTENT-DAY');
      }; break;
      case Filters.SEVEN: {
        this.noDataMessage.title = this._translateService.instant('NO-DATA.TITLE-SEVEN');
        this.noDataMessage.content = this._translateService.instant('NO-DATA.CONTENT-SEVEN');
      }; break;
      case Filters.EXPIRED: {
        this.noDataMessage.title = this._translateService.instant('NO-DATA.TITLE-OVERDUE');
        this.noDataMessage.content = this._translateService.instant('NO-DATA.CONTENT-OVERDUE');
      }; break;
      case Filters.ARCHIVED: {
        this.noDataMessage.title = this._translateService.instant('NO-DATA.TITLE-ARCHIVED');
      }; break;
      case Filters.ALL: {
        this.noDataMessage.title = this._translateService.instant('NO-DATA.TITLE-ALL');
        this.noDataMessage.content = this._translateService.instant('NO-DATA.CONTENT-ALL');
      }; break;
      default: { };
    }
  }

  /**
   * Abre o modal
   * 
   * @param {string} _id 
   * 
   * @memberOf TasksComponent
   */
  openModalRemove(_id: string): void {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
    this.idRemove = _id;
  }

  /**
   * Fecha o modal
   * 
   * @memberOf TasksComponent
   */
  closeModalRemove(): void {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
    this.idRemove = null;
  }

  /**
   * Deleta do banco a tarefa solicitada de acordo com o idRemove
   * 
   * @memberOf TasksComponent
   */
  removeTask(): void {
    if (this.idRemove) {
      this._tasksService.remove(this.idRemove).then(res => {
        if (res) {
          Materialize.toast(this._translateService.instant('REMOVE-TASK-SUCCESS'), 5000);
          this.tasks = this.tasks.filter(elem => elem._id !== res._id);
        }
      }).catch((err) => {
        Materialize.toast(this._translateService.instant('ERROR-SERVER'), 5000);
      });
    }
  }

  /**
   * Atualiza tarefa como finalizada.
   * 
   * @param {string} _id 
   * 
   * @memberOf TasksComponent
   */
  setDone(_id: string): void {
    this._tasksService.setDone(_id).subscribe(res => {
      if (res) {
        Materialize.toast(this._translateService.instant('TASK-FINALIZED-SUCCESS'), 5000);
        // Seleciona o objeto na lista de tarefas e atualiza o isFinalized. Assim a view tbm é atualizada
        (this.tasks.filter(item => item._id === _id)[0]).isFinalized = true;
      }
    }, (error) => {
      Materialize.toast(this._translateService.instant('TASK-FINALIZED-ERROR'), 5000);
    });
  }

  /**
   * Limpa campo de busca
   * 
   * @memberOf TasksComponent
   */
  cleanSearch(): void {
    this.iptTerm = "";
  }

  /**
   * Captura o que for digitado no campo de busca.
   * 
   * @param {*} event 
   * 
   * @memberOf TasksComponent
   */
  onKeySearch(event: any): void {
    if (event) {
      if (!this.noDataMessage) this.noDataMessage = {}

      this.noDataMessage.title = this._translateService.instant('NO-DATA.TITLE-SEARCH');
      this.noDataMessage.content = null;
    }
  }

  /**
   * Recupera a cor correspondente para o badge de acordo com o valor da prioridade.
   * 
   * @param {number} value 
   * @returns {string} 
   * 
   * @memberOf TasksComponent
   */
  getColorPriority(value: number): string {
    if (value === 1) // prioridade máxima
      return 'red lighten-1';
    else if (value === 2) // prioridade média
      return 'orange lighten-1';
    else if (value == 3) // prioridade normal
      return 'blue-grey lighten-1';

    return '';
  }

  /**
   * Recupera o formato da data de acordo com a linguagem da aplicação
   * 
   * @returns {string} 
   * 
   * @memberOf TasksComponent
   */
  getFormatDate(): string {
    if (this._translateService.getDefaultLang() === 'pt') {
      return 'dd/MM/yyyy'; // formato do piper do angular
    }
    return 'yyyy-MM-dd';
  }

  /**
   * Recupera o formato da data e hora de acordo com a linguagem da aplicação
   * 
   * @returns {string} 
   * 
   * @memberOf TasksComponent
   */
  getFormatDateTime(): string {
    return this.getFormatDate().concat(" ", "HH:mm");
  }

}
