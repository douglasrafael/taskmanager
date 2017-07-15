import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { Tasks } from 'app/tasks/tasks';
import { ValidationService } from 'app/validation/validation.service';
import { TasksService } from './../tasks.service';

declare var jQuery: any;
declare var Materialize: any;

@Component({
  selector: 'app-tasks-form',
  templateUrl: './tasks-form.component.html',
  styleUrls: ['./tasks-form.component.scss']
})
export class TasksFormComponent implements OnInit {
  task: Tasks;
  taskForm: FormGroup;
  showBoxNotice: boolean;
  fileTask: File;
  formProcessing: boolean;
  labelsInit: any;
  autocompleteInit: any;
  textButtonSend: string;
  paramsPickatime: any;

  constructor(private _formBuilder: FormBuilder, private _validationService: ValidationService,
    private _router: Router, private _route: ActivatedRoute, private _translateService: TranslateService,
    private _taskService: TasksService, private _location: Location) {

    this.showBoxNotice = false;
    this.formProcessing = false;
    this.autocompleteInit = {};

    this.task = new Tasks(null);

    this.paramsPickatime = [{
      default: 'now', // Set default time
      twelvehour: false, // Use AM/PM or 24-hour format
      autoclose: false, // automatic close timepicker
      donetext: 'Fechar',
      cleartext: 'Limpar',
      canceltext: 'Cancelar'
    }];
  }

  ngOnInit() {
    this.buildForm();
    this.buildjQuery();

    this._route.params.subscribe(params => {
      let id = params['id'];

      if (!id) {
        this.textButtonSend = this._translateService.instant('REGISTER');
        return; // sai do método
      }
      this.textButtonSend = this._translateService.instant('UPDATE');

      // Se existe id, então tenta reqcuperar do back os dados da tarefa.
      this.requestTask(id);
    });
  }

  /**
 * Monta o formulário.
 * As regras de validação são aplicadas.
 */
  buildForm(): void {
    this.taskForm = this._formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(15)]],
      description: ['', [Validators.minLength(25), Validators.maxLength(600)]],
      priority: ['', [Validators.maxLength(1)]],
      completionDate: ['', [Validators.required]],
      noticeDate: '',
      noticeHour: '',
      isFinalized: ''
    });

    /**
     * Recupera as labels cadastradas para setar no autocomplete
     */
    this._taskService.getLabels().subscribe(res => {
      // OUTPUT: { 'Apple': null, 'Microsoft': null, 'Google': null },
      for (let i = 0; i < res.length; i++) {
        this.autocompleteInit[res[i]] = null;
      }
      this.populaInputLabels({}, this.autocompleteInit);
    });
    this.task.priority = 3; // seta a prioridade default
  }

  /**
   * Popula tarefa de acordo com o id.
   * 
   * @private
   * @param {string} id 
   * 
   * @memberOf TasksFormComponent
   */
  private requestTask(id: string): void {
    this._taskService.getById(id).subscribe(res => {
      this.task = res;
      this.populaForm();
    }, (error) => {
      // Se não encontrar a tarefa exibe mensagem e redireciona para page nout found
      Materialize.toast(this._translateService.instant('TASK-NOT-FOUND'), 5000);
      this._router.navigate(['/error'])
    });
  }

  /**
   * Popula os campos do form que não possui suporte ao [(ngModel)]
   * 
   * @private
   * 
   * @memberOf TasksFormComponent
   */
  private populaForm(): void {
    if (this.task._id) {
      /**
       * Popula as tags no formato json válido para a view
       * { data: [{ tag: 'Apple', }, { tag: 'Microsoft', }, { tag: 'Google', }] };
       */
      if (this.task.labels.length > 0) {
        this.labelsInit = this.task.labels.map(function (elem) { return { tag: elem } });
      }

      if (this.task.noticeDate) {
        this.showBoxNotice = true;

        // Tenta corrigir bug label, pois por algum motivo as class (.active) aplicadas são removidas
        setTimeout(function () {
          jQuery('#label-notice-hour').addClass('active');
        }, 10);
      }

      if (this.task.file && this.task.isFinalized) {
        let file = this.task.file;
        setTimeout(function () {
          jQuery('.file-path').val(file);
        }, 10);
      }

      this.populaInputLabels(this.labelsInit, this.autocompleteInit);
    }
  }

  /**
   * Submete o form de task.
   * 
   * @memberOf TasksFormComponent
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.formProcessing = true;

      if (typeof this.task._id === 'undefined')
        this.task = new Tasks(this.taskForm.value as Tasks);

      this.task.labels = this.getLabels();
      this.task.completionDate = this.brDateToUs(this.taskForm.value.completionDate);
      if (this.showBoxNotice) {
        this.task.noticeDate = this.getNoticeDate();
      } else {
        this.task.noticeDate = null;
      }

      if (this.fileTask && this.task.isFinalized) { // Faz o upload do arquivo, caso exista.
        // se for atualizando e conter arquivo, remove o antigo antes de fazer o novo upload
        if ((typeof this.task._id !== 'undefined') && this.task.file) {
          this._taskService.deleteFile(this.task.file).subscribe();
        }

        // Preparando arquivo para upload
        let formData: FormData = new FormData();
        formData.append('file', this.fileTask, this.fileTask.name);

        this._taskService.uploadFile(formData).subscribe((data) => {
          // Após upload com sucesso seta no objeto task o filename que veio do back-end 
          this.task.file = data.file.filename;

          this.submit(this.task); // processo de inserção/atualização do objeto task
        }, (error) => {
          this.formProcessing = false;
          Materialize.toast(this._translateService.instant('ERROR-UPLOAD-FILE'), 5000);
        });
      } else {
        this.submit(this.task); // processo de inserção/atualização do objeto sem file
      }
    }
  }

  /**
   * Insere a tarefa.
   * 
   * @param {Tasks} task 
   * 
   * @memberOf TasksFormComponent
   */
  submit(task: Tasks): void {
    if (typeof task._id === 'undefined') {
      this._taskService.insert(task)
        .then(res => {
          if (res) {// verifica se o cadastro foi realizado com sucesso
            Materialize.toast(this._translateService.instant('TASK-REGISTERED'), 5000);
            this.resetForm();
          }
        }).catch((err) => {
          /**
           * Como ocorreu um erro no submit é verificado se ocorreu upload de arquivo,
           * Se ocorreu o mesmo deverá ser removido do servidor.
           */
          if (this.fileTask && this.task.file) {
            this._taskService.deleteFile(this.task.file).subscribe();
          }
          Materialize.toast(this._translateService.instant('ERROR-SERVER'), 5000);
        });
    } else {
      this._taskService.update(task)
        .then(res => {
          if (res) {// verifica se a atualização foi realizado com sucesso
            Materialize.toast(this._translateService.instant('TASK-UPDATED'), 5000);
            this.doBack();
          }
        }).catch((err) => {
          /**
           * Como ocorreu um erro no submit é verificado se ocorreu upload de arquivo,
           * Se ocorreu o mesmo deverá ser removido do servidor.
           */
          if (this.fileTask && this.task.file) {
            this._taskService.deleteFile(this.task.file).subscribe();
          }
          Materialize.toast(this._translateService.instant('ERROR-SERVER'), 5000);
        });
    }
    this.formProcessing = false;
  }

  /**
   * Manipula o box para inserir data e hora para alerta ou não.
   * 
   * @memberOf TasksFormComponent
   */
  onBoxNotice(): void {
    this.showBoxNotice = !this.showBoxNotice;

    /**
     * Se foi solicitado notificação seta os campos data e hora como obrigatórios.
     * Caso contrário remove a obrigatoriedade.
     */
    if (this.showBoxNotice) {
      this.taskForm.setControl('noticeDate', new FormControl('', [Validators.required]));
      this.taskForm.setControl('noticeHour', new FormControl('', [Validators.required]));
    } else {
      this.taskForm.removeControl('noticeDate');
      this.taskForm.removeControl('noticeHour');
    }
  }

  /**
   * Recupera formato para datas de acordo com a localidade.
   * 
   * @param {boolean} isInit 
   * @returns {string} 
   * 
   * @memberOf TasksFormComponent
   */
  getFormatDate(isInit: boolean): string {
    if (this._translateService.getDefaultLang() === 'pt') {
      if (isInit) return 'dd/MM/yyyy'; // formato do piper do angular
      return 'dd/mm/yyyy'; // formato do materializecss
    }
    if (isInit) return 'yyyy-MM-dd';
    return 'yyyy-mm-dd';
  }

  /**
   * Seta o arquivo selecionado do input no objeto fileTask
   * 
   * @param {any} event 
   * 
   * @memberOf TasksFormComponent
   */
  handleSelectFile(event): void {
    this.fileTask = event.target.files[0];
    console.log('event.target.files[0]: ', event.target.files[0]);
  }

  /**
   * Reseta o form. 
   * 
   * @private
   * 
   * @memberOf TasksFormComponent
   */
  private resetForm(): void {
    this.taskForm.reset();
    this.buildForm();
    this.buildjQuery();
    jQuery('input.file-path').val('');
    jQuery('input').removeClass('ng-invalid valid invalid ng-valid');
    this.fileTask = null;

    if (this.showBoxNotice) {
      this.onBoxNotice();
    }

    this.labelsInit = {}
    this.populaInputLabels(this.labelsInit, this.autocompleteInit);
  }

  /**
   * Recebe os valores do material_chip e retorna os valores em array.
   * 
   * @private
   * @returns {Array<string>} 
   * 
   * @memberOf TasksFormComponent
   */
  private getLabels(): Array<string> {
    let labels = jQuery('.chips-autocomplete').material_chip('data');
    return labels.map((item) => item.tag);
  }

  /**
   * Recupera a data e hora do DOM para o atributo noticeDate.
   * 
   * @private
   * @returns {string} 
   * 
   * @memberOf TasksFormComponent
   */
  private getNoticeDate(): string {
    return this.brDateToUs(this.taskForm.value.noticeDate) + " " + this.taskForm.value.noticeHour;
  }

  /**
   * Converte uma data no formato dd/mm/yyyy para yyyy-mm-dd
   * 
   * @private
   * @param {string} _str 
   * @returns {string} 
   * 
   * @memberOf TasksFormComponent
   */
  private brDateToUs(_str: string): string {
    if (_str.indexOf('/') >= 0) {
      let date = _str.split('/');
      return date[2].concat('-', date[1], '-', date[0]);
    }
    return _str;
  }

  /**
   * Força o label ficar ativo ao selecionar a hora/data
   * 
   * @param  
   */
  changedTime($event) {
    if (Materialize)
      Materialize.updateTextFields();
  }

  /**
   * Volta para página anterior.
   * 
   * @memberOf TasksFormComponent
   */
  doBack(): void {
    this._location.back();
  }

  removeFile(): void {
    this.fileTask = null;
    if (this.task.file) {
      this._taskService.deleteFile(this.task.file).subscribe();
      this.task.file = null;
    }

    setTimeout(function () {
      jQuery('.file-path').val("");
    }, 10);
  }

  /**
   * Pupula o input de labels
   * 
   * @private
   * @param {*} [elementsInit] 
   * @param {*} [autocomplete] 
   * 
   * @memberOf TasksFormComponent
   */
  private populaInputLabels(elementsInit?: any, autocomplete?: any): void {
    setTimeout(function () {
      jQuery('.chips-autocomplete').material_chip({
        data: elementsInit,
        placeholder: 'Enter p/ add',
        secondaryPlaceholder: '',
        autocompleteOptions: {
          data: autocomplete,
          limit: 3,
          minLength: 1
        }
      });
    }, 100);
  }

  /**
   * Inicializa os jQuerys necessários para o componente.
   * 
   * @memberOf TasksFormComponent
   */
  private buildjQuery(): void {
    jQuery(document).ready(function () {
      setTimeout(function () {
        jQuery('textarea').characterCounter();
      }, 100);
    });
  }

}
