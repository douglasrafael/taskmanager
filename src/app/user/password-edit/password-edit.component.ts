import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { ValidationService } from 'app/validation/validation.service';
import { UserService } from 'app/user/user.service';

declare var Materialize: any;

@Component({
  selector: 'app-password-edit',
  templateUrl: './password-edit.component.html',
  styleUrls: ['./password-edit.component.scss']
})
export class PasswordEditComponent implements OnInit {
  userForm: FormGroup;
  formProcessing: boolean;

  constructor(
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _validationService: ValidationService,
    private _location: Location,
    private _translate: TranslateService) {
    this.formProcessing = false;
  }

  ngOnInit() {
    /**
     * Realizando o mapeamento com componente com o form.
     */
    this.userForm = this._formBuilder.group({
      passwordOld: ['', [Validators.required]],
      password: ['', [Validators.required, this._validationService.passwordValidator]],
      passwordConfirm: ['', [Validators.required, this._validationService.passwordConfirm]]
    });
  }

  /**
   * Realiza tratamento dos dados do form para submissão.
   * 
   * @memberOf PasswordEditComponent
   */
  onSubmit(): void {
    this.formProcessing = true;
    this._userService.updatePassword(this.userForm.value).subscribe(res => {
      if (res) {
        Materialize.toast(this._translate.instant('PASSWORD-UPDATE-SUCCESS'), 5000);
        this._router.navigate(['/login']);
      }
    }, (err) => {
      this.formProcessing = false;
      if (err.status === 403)
        return Materialize.toast(this._translate.instant('VALIDATION.PASSWORD-OLD-NOT-MATCH'), 5000);
      Materialize.toast(this._translate.instant('ERROR-SERVER'), 5000);
    });
  }

  /**
   * Volta para página anterior 
   * 
   * @memberOf PasswordEditComponent
   */
  doBack(): void {
    this._location.back();
  }
}
