import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { Filters } from 'app/shared/constants/filters.constant';
import { TasksService } from 'app/tasks/tasks.service';
import { Tasks } from 'app/tasks/tasks';

import * as moment from 'moment';

declare var jsPDF: any;

@Component({
  selector: 'app-tasks-print',
  templateUrl: './tasks-print.component.html',
  styleUrls: ['./tasks-print.component.scss']
})
export class TasksPrintComponent implements OnInit {
  param: string;
  outputDoc: any;
  doc: any;
  noDataMessage: any;

  constructor(private _tasksService: TasksService,
    private _translateService: TranslateService,
    private _sanitizer: DomSanitizer,
    @Inject(Window) private _window: Window) {
    this.param = Filters.ALL;
  }

  ngOnInit() {
    this.generateDoc();
  }

  /**
   * Gerao o documento em PDF de acordo com o filtro selecionado
   * 
   * 
   * @memberOf TasksPrintComponent
   */
  generateDoc(): void {
    this.outputDoc = null;

    /**
     * Obtendo as tarefas de acordo com o filtro selecionado.
     */
    this._tasksService.listFilter(this.param).subscribe(tasks => {
      this.noDataMessage = null;
      
      if (tasks.length == 0) {
        this.buildNoDateMessage();
        return;
      } 

      let columns = [
        { title: this._translateService.instant('TITLE').toUpperCase(), dataKey: "title" },
        { title: this._translateService.instant('DESCRIPTION').toUpperCase(), dataKey: "description" },
        { title: this._translateService.instant('PRIORITY').toUpperCase(), dataKey: "priority" },
        { title: this._translateService.instant('REGISTRATION').toUpperCase(), dataKey: "dateCreated" },
        { title: this._translateService.instant('DATE-COMPLETION2').toUpperCase(), dataKey: "dateCompletion" },
        { title: this._translateService.instant('STATUS').toUpperCase(), dataKey: "status" },
        { title: this._translateService.instant('FILE').toUpperCase(), dataKey: "file" }
      ];
      let files = tasks.map(elem => { return {file: elem.file, isAdded: false} });

      /**
       * Preparando o objeto rows com as tarefas
       */
      let rows = new Array();
      for (let t of tasks) {
        let task = new Tasks(t, this._translateService);
        rows.push({
          title: task.title, description: task.description ? task.description : '',
          priority: task.priorityToString(), dateCompletion: moment(task.completionDate).format('ll'),
          dateCreated: moment(task.created_at).format('lll'), status: task.statusToString()
        });
      }

      let doc = new jsPDF('l', 'pt');
      let totalPagesExp = "{total_pages_count_string}";
      let titlePage = this.getTitle();
      let pageStr = this._translateService.instant('PAGE');
      let ofStr = this._translateService.instant('OF');
      let appTitle = this._translateService.instant('APP-TITLE') + " - " + this._translateService.instant('APP-SUBTITLE');
      let linksFiles = new Array();
      let path_base = this._window.location.origin;

      /**
       * Criando o conteudo da página
       * @param data 
       */
      let pageContent = function (data) {
        // HEADER
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.text(titlePage, data.settings.margin.left, 40);

        // FOOTER
        let str = pageStr.concat(" ", data.pageCount);
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str.concat(" ", ofStr, " ", totalPagesExp);
        }
        doc.setFontSize(8);
        doc.text(appTitle, doc.internal.pageSize.width - 205, doc.internal.pageSize.height - 20);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 20);

        // criando os links para download dos arquivos caso tenha
        for (let i = 0; i < linksFiles.length; i++) {
          if (typeof files[i] !== 'undefined' && files[i].file && !files[i].isAdded) {
            files[i].isAdded = true;
            doc.textWithLink('Download', linksFiles[i].x, linksFiles[i].y + 7, {
              url: path_base.concat('/uploads/files/', files[i].file)
            });
          }
        }
      };

      /**
       * Monta a tabela com os dados
       */
      doc.autoTable(columns, rows, {
        margin: { top: 50, left: 20, right: 20, bottom: 40 },
        styles: {
          overflow: 'linebreak',
          fontSize: 9,
        },
        drawCell: function (cell, opts) {
          if (opts.column.dataKey === 'file') {
            linksFiles.push({
              x: cell.textPos.x,
              y: cell.textPos.y
            });
          }
        },
        columnStyles: {
          text: { columnWidth: 'auto' },
          dateCreated: { columnWidth: 130 },
          dateCompletion: { columnWidth: 130 },
          priority: { columnWidth: 70 },
          status: { columnWidth: 50 },
          file: { columnWidth: 70 }
        },
        addPageContent: pageContent
      });

      // Total page number plugin only available in jspdf v1.0+
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }

      this.doc = doc;
      this.doc.setProperties({ title: this.getTitle() });
      this.outputDoc = this._sanitizer.bypassSecurityTrustResourceUrl(this.doc.output('datauristring'));
    })
  }

  /**
   * Faz o download do documento gerado.
   * 
   * @memberOf TasksPrintComponent
   */
  downloadDoc(): void {
    if (this.doc)
      this.doc.save("doc_".concat(moment().format('L'), ".pdf"));
  }

  /**
   * Monta título do documento de acordo com o filtro selecionado.
   * 
   * @returns {string} 
   * 
   * @memberOf TasksPrintComponent
   */
  getTitle(): string {
    if (this.param === Filters.TODAY) {
      return this._translateService.instant('TASKS-FOR-TODAY').concat(", ", moment().format('LL'));
    } else if (this.param === Filters.SEVEN) {
      return this._translateService.instant('TASKS-FOR-SEVEN-DAYS')
        .concat(", ", moment().format('L'), " ")
        .concat(this._translateService.instant('TO'), " ", moment().add(7, 'days').format('L'));
    } else if (this.param === Filters.EXPIRED) {
      return this._translateService.instant('TASKS-OVERDUE')
        .concat(" - ", this._translateService.instant('GENERATED-IN'), " ")
        .concat(moment().format('lll'));
    } else if (this.param === Filters.ARCHIVED) {
      return this._translateService.instant('TASKS-ARCHIVED')
        .concat(" - ", this._translateService.instant('GENERATED-IN'), " ")
        .concat(moment().format('lll'));
    }

    return this._translateService.instant('TASKS-ALL')
      .concat(" - ", this._translateService.instant('GENERATED-IN'), " ")
      .concat(moment().format('lll'));;
  }

  /**
   * Recupera mensagem personalizada para quando não tiver dados.
   * 
   * @returns {void} 
   * 
   * @memberOf TasksPrintComponent
  * */
  buildNoDateMessage(): void {
    this.noDataMessage = {}
    switch (this.param) {
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
}