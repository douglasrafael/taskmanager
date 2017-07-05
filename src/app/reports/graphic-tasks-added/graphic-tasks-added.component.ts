import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { Tasks } from 'app/tasks/tasks';
import { TasksService } from 'app/tasks/tasks.service';

import * as moment from 'moment';

@Component({
  selector: 'app-graphic-tasks-added',
  templateUrl: './graphic-tasks-added.component.html',
  styleUrls: ['./graphic-tasks-added.component.scss']
})
export class GraphicTasksAddedComponent implements OnInit {
  noDataMessage: any;
  tasks: Array<Tasks>;
  currentYear: number;

  chartData: Array<any>;
  chartLabels: Array<string>;
  chartType: string;
  chartOptions: any;
  chartColor: any;
  chartLegend: boolean;

  specificationContent: any;

  constructor(private _translateService: TranslateService, private _tasksSevice: TasksService) {
    this.chartData = new Array({ data: [], label: this._translateService.instant('REPORTS.TASKS-ADDED') });
    this.chartLabels = new Array();
    this.chartType = "line";
    this.chartOptions = { responsive: true, maintainAspectRatio: true }
    this.chartLegend = true;
    this.chartColor = [{
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)'
    }];

    this.currentYear = moment().year();
  }

  ngOnInit() {
    this._tasksSevice.listAll().subscribe(res => {
      this.tasks = res;

      this.buildChart();
    });

    this.noDataMessage = {
      title: this._translateService.instant('NO-DATA.TITLE-ALL'),
      content: this._translateService.instant('NO-DATA.CONTENT-ALL')
    };

  }

  /**
   * Monta o gráfico de tipo pie.
   * 
   * @private
   * 
   * @memberOf GraphicTasksAddedComponent
   */
  private buildChart(): void {
    if (this.tasks) {
      this.chartData[0].data = new Array();
      this.chartLabels = moment.months(); // obtem array com os nomes dos meses

      /**
       * filtrando a lista de tasks para obter o toral de cada més
       */
      for (let i = 0; i <= 12; i++) {
        this.chartData[0].data.push(this.tasks.filter(elem => this.isValidElemYear(elem, i)).length);
      }

      this.buildSpecificationContent(this.chartData);
    }
  }

  /**
   * Valida elemento passado como parâmetro se:
   * - Ano de created_at = ano atual
   * - Més da created_at = mês passado como parâmetro
   * 
   * @private
   * @param {*} elem 
   * @param {number} month 
   * @returns {boolean} 
   * 
   * @memberOf GraphicProductivityComponent
   */
  private isValidElemYear(elem: any, month: number): boolean {
    return (moment(elem.created_at).year() === this.currentYear && moment(elem.created_at).month() === month);
  }

  /**
   * Monta string com as especificações/dados do gráfico.
   * 
   * @param {*} chartData 
   * 
   * @memberOf GraphicTasksAddedComponent
   */
  buildSpecificationContent(chartData: any): void {
    this.specificationContent = "<div class='row'><div class='col s6'>";

    for (let i = 0; i < 12; i++) {
      if (i === 6)
        this.specificationContent += "</div><div class='col s6'>";

      this.specificationContent += "<b>- ".concat(this.chartLabels[i]);
      this.specificationContent += ":</b> ".concat(chartData[0].data[i], "<br/>");
    }
  }

}
