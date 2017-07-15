import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { Tasks } from 'app/tasks/tasks';
import { TasksService } from 'app/tasks/tasks.service';

import * as moment from 'moment';

@Component({
  selector: 'app-graphic-comparison',
  templateUrl: './graphic-comparison.component.html',
  styleUrls: ['./graphic-comparison.component.scss']
})
export class GraphicComparisonComponent implements OnInit {
  noDataMessage: any;
  tasks: Array<Tasks>;

  chartData: Array<number>;
  chartLabels: Array<string>;
  chartType: string;
  chartOptions: any;
  chartColor: any;

  specificationContent: any;

  constructor(private _translateService: TranslateService, private _tasksSevice: TasksService) {
    this.chartData = new Array();
    this.chartLabels = new Array();
    this.chartType = "doughnut";
    this.chartOptions = { responsive: true, maintainAspectRatio: true }

    this.chartColor = [{
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(75, 192, 192, 0.5)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)'
      ],
    }];
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
   * Mont ao gráfico do tipo pie
   * 
   * @private
   * 
   * @memberOf GraphicComparisonComponent
   */
  private buildChart(): void {
    if (this.tasks) {
      // seta os labels
      this.chartLabels = new Array(
        this._translateService.instant('TASKS-ACTIVE'),
        this._translateService.instant('TASKS-OVERDUE'),
        this._translateService.instant('TASKS-ARCHIVED')
      );

      let dateToday = moment(moment().format('YYYY-MM-DD')); // Obtendo data atual

      // seta os valores no data do chart
      this.chartData = new Array(
        this.tasks.filter(elem => !elem.isFinalized).length,
        this.tasks.filter(elem => (!elem.isFinalized && moment(elem.completionDate).diff(dateToday) < 0)).length,
        this.tasks.filter(elem => elem.isFinalized).length
      );

      this.specificationContent = ""
        .concat("<b>- ", this._translateService.instant('TASKS-ACTIVE'))
        .concat(":</b> ", ("00" + this.chartData[0]).slice(-2))
        .concat("<br/><b>- ", this._translateService.instant('TASKS-OVERDUE2'))
        .concat(":</b> ", ("00" + this.chartData[1]).slice(-2))
        .concat("<br/><b>- ", this._translateService.instant('TASKS-ARCHIVED2'))
        .concat(":</b> ", ("00" + this.chartData[2]).slice(-2))
    }
  }

}
