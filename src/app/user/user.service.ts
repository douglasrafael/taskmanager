import { Observable } from 'rxjs/Observable';
import { RequestOptions, Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import { User } from './user';

@Injectable()
export class UserService {
  private URL = 'http://localhost:3000';
  headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
  options = new RequestOptions({ headers: this.headers });

  constructor(private _http: Http) { }

  /**
   * Realiza login no sistema.
   * 
   * @param {string} email 
   * @param {string} password 
   * @param {boolean} rememberme 
   * @returns {Promise<User>} 
   * 
   * @memberOf UserService
   */
  login(email: string, password: string, rememberme: boolean): Promise<User> {
    return this._http.post(this.URL + '/api/users/authenticate', JSON.stringify({ email: email, password: password }), this.options)
      .toPromise()
      .then((response: Response) => {
        let user = response.json().user;
        let token = response.json().token;

        if (user) {
          // Se solicitado o lembra-me, salva o id e token do usuário logado
          if (rememberme) {
            localStorage.setItem('currentUser', JSON.stringify({ '_id': user._id, 'token': token }));
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify({ '_id': user._id, 'token': token }));
          }

          // return o usuário logado
          return user;
        } else {
          // return false to indicate failed login
          return null;
        }
      }).catch(this.handleError);
  }

  /**
   * Verifica se o usuário têm permissão no sistema.
   * Útil quando se deseja verificar antes de realizar uma operação importante.
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {Observable<boolean>} 
   * 
   * @memberOf UserService
   */
  verifyPermission(email: string, password: string): Observable<boolean> {
    return this._http.post(this.URL + '/api/users/authenticate', JSON.stringify({ email: email, password: password }), this.options)
      .map(res => {
        if (res) return true;
        return false;
      }).catch(this.handleError);
  }

  /**
   * Faz upload da imagem do usuário.
   * 
   * @param {FormData} formData 
   * @returns {Observable<any>} 
   * 
   * @memberOf UserService
   */
  uploadAvatar(formData: FormData): Observable<any> {
    return this._http.post(this.URL + '/api/users/upload/avatar', formData)
      .map((res) => {
        return res.json();
      }).catch(this.handleError);
  }

  /**
   * Remove do servidor a imagem de acordo com o filename passado como parâmetro.
   * 
   * @param {string} filename 
   * @returns {Observable<any>} 
   * 
   * @memberOf UserService
   */
  deleteAvatar(filename: string): Observable<any> {
    return this._http.delete(this.URL + '/api/users/upload/avatar/'.concat(filename), this.options)
      .map(res => res)
      .catch(this.handleError);
  }

  /**
   * Desloga o usuário do sistema removendo os dados salvos no webstorage do navegador.
   * 
   * @memberOf UserService
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  /**
   * Recupera os dados completo do usuário logado. 
   * 
   * @returns {Observable<User>} 
   * 
   * @memberOf UserService
   */
  getUserLogged(): Observable<User> {
    this.setTokenHeader();

    return this._http.get(this.URL + '/api/users', this.options)
      .map((res: Response) => {
        if (res) return res.json() as User;

        return null;
      }).catch(this.handleError);
  }

  /**
   * Cadastro um novo usuário no sistema
   * 
   * @param {User} user 
   * @returns {Promise<boolean>} 
   */
  signup(user: User): Promise<boolean> {
    return this._http.post(this.URL + '/api/users/signup', user, this.options)
      .toPromise()
      .then((res: Response) => {
        if (res) return true;
        return false;
      }).catch(this.handleError);
  }

  /**
   * Atualiza dados do usuário.
   * OBS. O password não deverá ser atualizado por aqui. 
   * Pois, esse método não garante a criptografia do password.
   * 
   * @param {User} user 
   * @returns {Observable<User>} 
   * 
   * @memberOf UserService
   */
  updateAllNotPassword(user: User): Observable<User> {
    this.setTokenHeader();
    user.password = null; // garantia que o password não será atualizado por esse método.

    return this._http.put(this.URL + '/api/users', user, this.options)
      .map(res => {
        if (res) return res.json() as User;

        return null;
      }).catch(this.handleError);
  }

  /**
   * Atualiza o password do usuário.
   * O password será criptografado antes de ser salvo.
   * 
   * @param {any} form 
   * @returns {Observable<boolean>} 
   * 
   * @memberOf UserService
   */
  updatePassword(form: any): Observable<boolean> {
    this.setTokenHeader();

    return this._http.put(this.URL + '/api/users/password', form, this.options)
      .map(res => {
        if (res) return true;
        return false;
      }).catch(this.handleError);
  }

  /**
   * Remove permanentemente o usuário do sistema.
   * 
   * @returns {Observable<boolean>} 
   * 
   * @memberOf UserService
   */
  delete(): Observable<boolean> {
    this.setTokenHeader();
    return this._http.delete(this.URL + '/api/users', this.options)
      .map(res => {
        if (res) return true;

        return false;
      }).catch(this.handleError);
  }

  /**
   * Recupera objeto com os dados do usuário logado salvos no storage do navegador.
   * (_id e token) são os atributos do objeto.
   * 
   * @returns {object} 
   * 
   * @memberOf UserService
   */
  getDataStorage(): object {
    return JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
  }

  /**
   * Recupera string pronta do token do usuário logado pronta para as requisições.
   * 
   * @returns {string} 
   * 
   * @memberOf UserService
   */
  getToken(): string {
    let token = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'))['token'];
    return 'JWT '.concat(token);
  }

  /**
   * Recupera string pronta do token do usuário logado pronta para as requisições.
   * 
   * @returns {string} 
   * 
   * @memberOf UserService
   */
  getId(): string {
    let data = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    return data['_id'];
  }

  /**
   * Verifica se usuário está logado.
   * 
   * @returns {boolean} 
   * 
   * @memberOf UserService
   */
  isLogged(): boolean {
    if (localStorage.getItem('currentUser')
      || sessionStorage.getItem('currentUser')) return true;

    return false;
  }

  /**
   * Verifcia se tem o token no header e insere caso contrário.
   * 
   * @private
   * 
   * @memberOf UserService
   */
  private setTokenHeader(): void {
    if (!this.options.headers.get('Authorization'))
      this.options.headers.append('Authorization', this.getToken());
  }

  /**
   * Mapeia os erros das solicitações http.
   * 
   * @private
   * @param {*} error 
   * @returns {Promise<any>} 
   * 
   * @memberOf UserService
   */
  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

}
