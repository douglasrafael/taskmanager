import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Component, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { Languages } from 'app/shared/constants/languages.constant';
import { UserService } from 'app/user/user.service';

declare var Materialize: any;

@Component({
  selector: 'app-application-settings',
  templateUrl: './application-settings.component.html',
  styleUrls: ['./application-settings.component.scss']
})
export class ApplicationSettingsComponent implements OnInit {

  langs: Array<string>;
  languageSelected: string;

  constructor(private _translateService: TranslateService, private _router: Router, private _userService: UserService) {
    this.languageSelected = this._translateService.getDefaultLang();
  }

  ngOnInit() {
    this.langs = Languages.getLanguages();
  }

  applyChanges(): void {
    localStorage.setItem('lang', this.languageSelected);

    window.location.reload();
  }

  /**
   * Desloga usuário do sistema.
   * 
   * @memberOf ApplicationSettingsComponent
   */
  logout(): void {
    this._userService.logout();
    this._router.navigate(['/login']);
  }

}
