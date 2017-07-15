import { TranslateService } from 'ng2-translate';
import { Server } from 'app/shared/constants/server';

import * as moment from 'moment';

export class Tasks {
    _id: string;
    title: string;
    description: string;
    priority: number; // 1 prioridade máxima, 2 média, 3 normal
    labels: Array<string>;
    completionDate: string;
    noticeDate: string;
    file: string;
    isFinalized: boolean
    user: string;
    updated_at: Date;
    created_at: Date;

    constructor(task?: any, private _translate?: TranslateService) {
        if (task) {
            this._id = task._id;
            this.title = task.title;
            this.description = task.description;
            this.priority = task.priority;
            this.labels = task.labels;
            this.completionDate = task.completionDate;
            this.noticeDate = task.noticeDate;
            this.file = task.file;
            this.isFinalized = task.isFinalized;
            this.user = task.user;
            this.updated_at = task.updated_at;
            this.created_at = task.created_at;
        }
    }

    /**
     * Recupera a representação textual do status:
     * ATIVA | ARQUIVADA
     * 
     * @returns {string} 
     * 
     * @memberOf Tasks
     */
    statusToString(): string {
        if (this.isFinalized) return this._translate.instant('STATUS-INACTIVE');

        return this._translate.instant('STATUS-ACTIVE');
    }

    /**
     * Recupera a representação textual da prioridade:
     * NORMAL | MÉDIA | MAXIMA
     * 
     * @returns {string} 
     * 
     * @memberOf Tasks
     */
    priorityToString(): string {
        if (this.priority === 1) {
            return this._translate.instant('PRIORITY-1'); // máxima
        } else if (this.priority === 2) {
            return this._translate.instant('PRIORITY-1'); // média
        }
        return this._translate.instant('PRIORITY-3'); // normal
    }

    /**
     * Recupera em string ano, mes e dias para conclusão da tarefa.
     * Apenas dias positivos
     * 
     * @returns {*} 
     * 
     * @memberOf Tasks
     */
    completionDateStr(): any {
        let dt1 = moment(moment().format('YYYY-MM-DD')); // data de hoje
        let dt2 = moment(this.completionDate);

        let result: any = this.diffDate(dt1, dt2); // diferença entre as duas datas

        let resultStr: string = "";

        if (result.years === 0 && result.months === 0 && result.days === 0) {
            resultStr = this._translate.instant('FOR-TODAY');
        } else {
            if (result.years > 0) {
                resultStr = (result.years === 1) ? (result.years).toString().concat(" ", this._translate.instant('DATE.YEAR'), "") :
                    (result.years).toString().concat(" ", this._translate.instant('DATE.YEARS'));
            } else if (result.months > 0) {
                resultStr += (result.months === 1) ? (result.months).toString().concat(" ", this._translate.instant('DATE.MONTH')) :
                    (result.months).toString().concat(" ", this._translate.instant('DATE.MONTHS'));
            } else if (result.days > 0) {
                resultStr += (result.days === 1) ? (result.days).toString().concat(" ", this._translate.instant('DATE.DAY')) :
                    (result.days).toString().concat(" ", this._translate.instant('DATE.DAYS'));
            } else {
                // Se ano, mes ou dia não for maior que 0 significa que a tarefa está expirada
                return this._translate.instant('OVERDUE'); // em atraso
            }

            resultStr = resultStr.concat(" ", this._translate.instant('FOR-COMPLETION'))
        }

        return resultStr;
    }

    /**
     * Retorna diferença entre duas datas
     * 
     * Object { years: 0, months: 0, days: 0 }
     * 
     * @param {*} date1 
     * @param {*} date2 
     * @returns {*} 
     * 
     * @memberOf Tasks
     */
    diffDate(dt1: any, dt2: any): any {
        let diff = {
            years: dt2.diff(dt1, 'years'),
            months: dt2.diff(dt1, 'months'),
            days: dt2.diff(dt1, 'days')
        };

        return diff;
    }

    /**
     * Monta a url completa para download do arquivo
     * 
     * @returns {string} 
     * 
     * @memberOf Tasks
     */
    getUrlDownloadFile(): string {
        return Server.URL_BASE.concat('api/tasks/file/', this.file);
    }
}