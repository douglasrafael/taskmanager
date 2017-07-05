import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';

import { User } from 'app/user/user';
import { Tasks } from 'app/tasks/tasks';
import { UserService } from 'app/user/user.service';
import { Filters } from 'app/shared/constants/filters.constant';
import { TasksService } from 'app/tasks/tasks.service';

declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  headerSmaller: boolean = false; // TODO utilizado na nav direita. Remover se não for utilizar
  user: User;
  alerts: Array<Tasks>;
  avatarSrc: string;
  paramsDropdown: Array<any>;
  titlePage: Observable<string>;
  isPageHome: boolean;

  constructor(
    private _titleService: Title,
    private _elementRef: ElementRef,
    private _userService: UserService,
    private _tasksService: TasksService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _translateService: TranslateService) {

    this._translateService.get(['APP-TITLE', 'APP-SUBTITLE']).subscribe(res => {
      this._titleService.setTitle(res['APP-TITLE'].concat(' - ', res['APP-SUBTITLE']));
    });

    this.isPageHome = true;
  }

  /**
   * Desloga usuário do sistema.
   * 
   * @memberOf HomeComponent
   */
  logout(): void {
    this._userService.logout();
    this._router.navigate(['/login']);
  }

  /**
   * Executado após o costrutor.
   * 
   * @memberOf HomeComponent
   */
  ngOnInit() {
    if (this._router.url === '/')
      this._router.navigate(['/tasks/list/seven']);

    // Set ao título da página no navbar
    this.titlePage = this._router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.getTitlePage(this._router.routerState.snapshot.root));

    // Pega os dados do usuário logado
    this._userService.getUserLogged().subscribe((res) => {
      this.user = new User(res, this._translateService);
      if (this.user.avatar && this.user.avatar != '')
        this.avatarSrc = 'uploads/users/'.concat(this.user.avatar);
    });

    // lista as alertas caso tenha
    this._tasksService.listFilter('alert').subscribe(res=> {
      this.alerts = res.map(elem=>{
        return new Tasks(elem, this._translateService);
      });
    });

    // Parametros para o menu dropdown
    this.paramsDropdown = [{
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Não altera a largura do menu suspenso
      hover: false, // Menu ativado no hover
      gutter: 0, // Espaçamento da borda
      alignment: 'right',
      belowOrigin: true // Abre menu abaixo do link
    }];
  }

  /**
   * Volta para página anterior.
   * 
   * @memberOf HomeComponent
   */
  doBack(): void {
    this._location.back();
  }

  /**
   * Pega o titulo da página.
   * 
   * @returns {string} 
   * 
   * @memberOf HomeComponent
   */
  getTitlePage(routeSnapshot: ActivatedRouteSnapshot) {
    this.isPageHome = false;
    let title = routeSnapshot.data ? routeSnapshot.data['title'] : '';
    if (routeSnapshot.firstChild) {
      title = this.getTitlePage(routeSnapshot.firstChild) || title;
    }

    if (title === 'task-list') {
      this.isPageHome = true;
      // Obtendo os parametros da url
      let params = routeSnapshot.params;

      switch (params['p']) {
        case Filters.TODAY: title = this._translateService.instant('TASKS-FOR-TODAY'); break;
        case Filters.SEVEN: title = this._translateService.instant('TASKS-FOR-SEVEN-DAYS'); break;
        case Filters.EXPIRED: title = this._translateService.instant('TASKS-OVERDUE'); break;
        case Filters.ARCHIVED: title = this._translateService.instant('TASKS-ARCHIVED'); break;
        default: title = this._translateService.instant('TASKS-ALL'); break;
      }

    } else if (title === 'task-create') {
      title = this._translateService.instant('REGISTER-TASK');
    } else if (title === 'task-edit') {
      title = this._translateService.instant('UPDATE-TASK');
    } else if (title === 'task-print') {
      title = this._translateService.instant('PRINT-TASK');
    } else if (title === 'user-edit') {
      title = this._translateService.instant('USER-DATA');
    } else if (title === 'user-password') {
      title = this._translateService.instant('USER-PASSWORD-EDIT');
    } else if (title === 'user-remove') {
      title = this._translateService.instant('USER-REMOVE-ACCOUNT');
    } else if (title === 'user-app-settings') {
      title = this._translateService.instant('APP-SETTINGS');
    } else if (title === 'reports') {
      title = this._translateService.instant('REPORT');
    }

    return title;
  }


}
