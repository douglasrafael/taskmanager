import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { BaseChartDirective } from 'ng2-charts';

import { Tasks } from 'app/tasks/tasks';
import { TasksService } from 'app/tasks/tasks.service';

import * as moment from 'moment';

@Component({
  selector: 'app-graphic-productivity',
  templateUrl: './graphic-productivity.component.html',
  styleUrls: ['./graphic-productivity.component.scss']
})
export class GraphicProductivityComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  isProductivity: boolean;

  noDataMessage: any;
  tasks: Array<Tasks>;
  currentYear: number;
  currentMonth: number;

  chartData: Array<any>;
  chartLabels: Array<string>;
  chartType: string;
  chartOptions: any;
  chartColor: any;
  chartLegend: boolean;

  specificationContent: any;
  MenuItemSelected: any;

  constructor(private _translateService: TranslateService, private _tasksSevice: TasksService) {
    this.isProductivity = true;

    this.chartData = new Array({ data: [], label: this._translateService.instant('TASKS-ARCHIVED2') });
    this.chartLabels = new Array();
    this.chartType = "line";
    this.chartOptions = { responsive: true, maintainAspectRatio: true }
    this.chartLegend = true;
    this.chartColor = [{
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)'
    }];

    this.currentYear = moment().year();
    this.currentMonth = moment().month();
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
   * Recebe a o valor do menu clicado
   * 
   * @param {*} value 
   * 
   * @memberOf GraphicProductivityComponent
   */
  onNotifyItemMenuClicked(value: any) {
    this.MenuItemSelected = value;
    this.buildChart();
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
      this.chartLabels = new Array();

      if (this.MenuItemSelected === 'yearCurrent') {
        this.chartLabels = moment.months(); // obtem array com os nomes dos meses
        
        /**
         * filtrando a lista de tasks para obter o toral de cada més
         */
        for (let i = 0; i < 12; i++) {
          this.chartData[0].data.push(this.tasks.filter(elem => this.isValidElemYear(elem, i)).length);
        }
      } else {
        let day = this._translateService.instant('DATE.DAY');

        // loop com o total de dias do mês atual
        for (let i = 1; i <= moment().daysInMonth(); i++) {
          this.chartLabels.push(day.concat(' ', i)); // dia n
          this.chartData[0].data.push(this.tasks.filter(elem => this.isValidElemMonth(elem, i)).length);
        }
      }

      this.buildSpecificationContentMonth(this.chartData);
    }

    this.updateChart();
  }

  /**
   * Valida elemento passado como parâmetro se:
   * - Ano de updated_at = ano atual
   * - Més da updated_at = mês passado como parâmetro
   * - Se finalizado
   * 
   * @private
   * @param {*} elem 
   * @param {number} month 
   * @returns {boolean} 
   * 
   * @memberOf GraphicProductivityComponent
   */
  private isValidElemYear(elem: any, month: number): boolean {
    return (moment(elem.updated_at).year() === this.currentYear && 
    moment(elem.updated_at).month() === month) && (elem.isFinalized);
  }

  /**
   * Valida elemento passado como parâmetro se:
   * - Ano de updated_at = ano atual
   * - Més da updated_at = mês atual
   * - Dia da updated_at = ao dia passado como parâmetro
   * - Se finalizado
   * 
   * @private
   * @param {*} elem 
   * @param {*} day 
   * @returns {boolean} 
   * 
   * @memberOf GraphicProductivityComponent
   */
  private isValidElemMonth(elem: any, day: any): boolean {
    return (moment(elem.updated_at).year() === this.currentYear && moment(elem.updated_at).month() === moment().month()) && 
    (moment(elem.updated_at).format('D') == day && elem.isFinalized);
  }

  /**
   * Monta string com as especificações/dados do gráfico.
   * 
   * @param {*} chartData 
   * 
   * @memberOf GraphicTasksAddedComponent
   */
  buildSpecificationContentMonth(chartData: any): void {
    if(this.MenuItemSelected === 'yearCurrent') {
      this.specificationContent = "<div class='row'><div class='col s6'>";

      for (let i = 0; i < 12; i++) {
        if (i === 6)
          this.specificationContent += "</div><div class='col s6'>";
        
        this.specificationContent += "<b>- ".concat(this.chartLabels[i]);
        this.specificationContent += ":</b> ".concat(chartData[0].data[i], "<br/>");
      }
    } else {
      let day = this._translateService.instant('DATE.DAY');
      let numberOfDays = moment().daysInMonth();
      let halfDays = ((numberOfDays / 3) % 1 === 0) ? Math.floor(numberOfDays / 3) : Math.floor(numberOfDays / 3) + 1;
      let count = 0;

      this.specificationContent = "<div class='row'><div class='col s4'>";
      for (let i = 0; i < numberOfDays; i++) {
        if (count === halfDays) {
          this.specificationContent += "</div><div class='col s4'>";
          count = 0;
        }
        this.specificationContent += "<b>- ".concat(this.chartLabels[i]);
        this.specificationContent += ":</b> ".concat(chartData[0].data[i], "<br/>");

        count++;
      }
    }
    
    this.specificationContent += "</div></div>";
  }

  /**
   * Atualiza o chart por completo
   * 
   * @private
   * 
   * @memberOf ReportsComponent
   */
  private updateChart(): void {
    setTimeout(() => {
      if (this.chart && this.chart.chart && this.chart.chart.config) {
        this.chart.chart.config.data.labels = this.chartLabels;
        this.chart.chart.update();
      }
    }, 100);
  }
}
