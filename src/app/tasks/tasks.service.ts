import { Observable } from 'rxjs/Observable';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { UserService } from 'app/user/user.service';
<<<<<<< HEAD
import { Tasks } from 'app/tasks/tasks';
import { Server } from 'app/shared/constants/server';
=======
import { Tasks } from './tasks';
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class TasksService {
<<<<<<< HEAD
  private URL = Server.URL_BASE;
  private headers: Headers;
  private options: RequestOptions;
=======
  private URL = 'http://localhost:3000';
  headers: Headers;
  options: RequestOptions;
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

  constructor(private _http: Http, private _userService: UserService) {
    this.headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this._userService.getToken() });
    this.options = new RequestOptions({ headers: this.headers });
  }

  /**
   * Lista todas as tarefas do usuário logado.
   * 
   * @returns {Observable<Tasks[]>} 
   * 
   * @memberOf TasksService
   */
  listAll(): Observable<Tasks[]> {
<<<<<<< HEAD
    return this._http.get(this.URL + 'api/tasks/', this.options)
=======
    return this._http.get(this.URL + '/api/tasks/', this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .map((res) => res.json() as Array<Tasks>)
      .catch(this.handleError);
  }

  /**
   * Lista tarefas de acordo com o parâmetro: today, seven, expired, archived or all
   * 
   * @param {string} param 
   * @returns {Observable<Tasks[]>} 
   * 
   * @memberOf TasksService
   */
  listFilter(param: string): Observable<Tasks[]> {
<<<<<<< HEAD
    return this._http.get(this.URL + 'api/tasks/filter/'.concat(param), this.options)
      .map((res) => res.json() as Tasks[])
      .catch(this.handleError);
=======
    return this._http.get(this.URL + '/api/tasks/filter/'.concat(param), this.options)
    .map((res) => res.json() as Tasks[])
    .catch(this.handleError);
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
  }

  /**
   * Recupera tasks de acordo com o id passado como parâmetro.
   * 
   * @param {string} id 
   * @returns {Observable<Tasks>} 
   * 
   * @memberOf TasksService
   */
  getById(id: string): Observable<Tasks> {
<<<<<<< HEAD
    return this._http.get(this.URL + 'api/tasks/'.concat(id), this.options)
=======
    return this._http.get(this.URL + '/api/tasks/'.concat(id), this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .map((res) => res.json() as Tasks)
      .catch(this.handleError);
  }

  /**
   * Recupera todas as labels cadastradas pelo usuário.
   * 
   * @returns {Observable<any>} 
   * 
   * @memberOf TasksService
   */
  getLabels(): Observable<any> {
<<<<<<< HEAD
    return this._http.get(this.URL + 'api/tasks/labels/list', this.options)
=======
    return this._http.get(this.URL + '/api/tasks/labels/list', this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .map((res) => res.json())
      .catch(this.handleError);
  }

  /**
   * Cadastra uma nova tarefa no sistema
   * 
   * @param {Tasks} task 
   * @returns {Promise<boolean>} 
   */
  insert(task: Tasks): Promise<boolean> {
<<<<<<< HEAD
    return this._http.post(this.URL + 'api/tasks', task, this.options)
=======
    return this._http.post(this.URL + '/api/tasks', task, this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .toPromise()
      .then((res: Response) => {
        if (res) return true;
        return false;
      }).catch(this.handleError);
  }

  /**
   * Atualiza tarefa de acordo com o id.
   * 
   * @param {Tasks} task 
   * @returns {Promise<boolean>} 
   * 
   * @memberOf TasksService
   */
  update(task: Tasks): Promise<boolean> {
<<<<<<< HEAD
    return this._http.put(this.URL + 'api/tasks/'.concat(task._id), task, this.options)
=======
    return this._http.put(this.URL + '/api/tasks/'.concat(task._id), task, this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .toPromise()
      .then((res: Response) => {
        if (res) return true;
        return false;
      }).catch(this.handleError);
  }

  /**
   * Remove tarefa de acordo com o id passado como parâmetro.
   * 
   * @param {string} _id 
   * @returns {Promise<Tasks>} 
   * 
   * @memberOf TasksService
   */
  remove(_id: string): Promise<Tasks> {
<<<<<<< HEAD
    return this._http.delete(this.URL + 'api/tasks/'.concat(_id), this.options)
=======
    return this._http.delete(this.URL + '/api/tasks/'.concat(_id), this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .toPromise()
      .then((res: Response) => {
        if (res) return res.json() as Tasks;
        return null;
      }).catch(this.handleError);
  }

  /**
   * Faz upload de arquivos da task.
   * Objeto com os dados do arquivo é retornado.
   * 
   * @param {FormData} formData 
   * @returns {Observable<any>} 
   * 
   * @memberOf TasksService
   */
  uploadFile(formData: FormData): Observable<any> {
<<<<<<< HEAD
    return this._http.post(this.URL + 'api/tasks/file', formData)
      .map((res) => {
        return res.json();
      }).catch(this.handleError);
=======
    return this._http.post(this.URL + '/api/tasks/upload/file', formData)
      .map((res) => res.json())
      .catch(this.handleError);
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
  }

  /**
   * Deleta arquivo armazenado no servidor.
   * 
   * @param {string} filename 
   * @returns {Observable<any>} 
   * 
   * @memberOf TasksService
   */
  deleteFile(filename: string): Observable<any> {
<<<<<<< HEAD
    return this._http.delete(this.URL + 'api/tasks/file/'.concat(filename), this.options)
=======
    return this._http.delete(this.URL + '/api/tasks/upload/file/'.concat(filename), this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Atualiza tarefa como finalizada.
   * 
   * @param {string} _id 
   * @returns {Observable<boolean>} 
   * 
   * @memberOf TasksService
   */
  setDone(_id: string): Observable<boolean> {
<<<<<<< HEAD
    return this._http.put(this.URL + 'api/tasks/setdone/'.concat(_id), {}, this.options)
=======
    return this._http.put(this.URL + '/api/tasks/setdone/'.concat(_id), {}, this.options)
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Manipula os erros das requisições.
   * 
   * @private
   * @param {*} error 
   * @returns {Promise<any>} 
   * 
   * @memberOf TasksService
   */
  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

}
