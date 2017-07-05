import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from 'ng2-translate';

import { UserService } from 'app/user/user.service';
import { User } from 'app/user/user';
import { ValidationService } from 'app/validation/validation.service';

declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _userService: UserService,
    private _validationService: ValidationService, private _router: Router, private _translateService: TranslateService) { }

  ngOnInit() {
    this.buildForm();
  }

  /**
   * Monta o formulário com as regras de validação.
   */
  buildForm(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, this._validationService.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this._validationService.passwordValidator]],
      rememberme: false
    });
  }

  /**
   * Submete o form de login para autenticação
   */
  onSubmit() {
    this._userService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.rememberme)
      .then(user => {
        if (user) return this._router.navigate(['/']);
      }).catch(err => {
        if(err.status == 403) return Materialize.toast(this._translateService.instant('VALIDATION.LOGIN-INVALID'), 5000);

         Materialize.toast(this._translateService.instant('ERROR-SERVER'), 5000);
      });
  }

}


