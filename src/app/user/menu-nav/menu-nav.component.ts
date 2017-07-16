import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { UserService } from 'app/user/user.service';

@Component({
  selector: 'menu-nav',
  templateUrl: './menu-nav.component.html'
})
export class MenuNavComponent implements OnInit {
  modalActions: EventEmitter<string | MaterializeAction>;

  constructor(private _userService: UserService, private _router: Router) {
    this.modalActions = new EventEmitter<string | MaterializeAction>();
  }

  ngOnInit() { }

  /**
   * Abre modal para confirmar saída da app.
   * 
   * @memberOf MenuNavComponent
   */
  openModalExitApp(): void {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
  }

  /**
   * Fecha o modal
   * 
   * @memberOf MenuNavComponent
   */
  closeModalExitApp(): void {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }

  /**
   * Desloga usuário do sistema.
   * 
   * @memberOf MenuNavComponent
   */
  logout(): void {
    this._userService.logout();
    this._router.navigate(['/login']);
  }
}
