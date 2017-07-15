import { TranslateService } from 'ng2-translate';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { UserService } from 'app/user/user.service';
import { User } from "app/user/user";

declare var Materialize: any;

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.scss']
})
export class RemoveAccountComponent implements OnInit {
  form: FormGroup;
  formProcessing: boolean;
  user: User;

  constructor(private _formBuild: FormBuilder, private _userService: UserService, private _router: Router, private _translateService: TranslateService) {
    this.formProcessing = false;
  }

  ngOnInit() {
    this._userService.getUserLogged().subscribe(res => {
      this.user = res;
    });

    this.form = this._formBuild.group({
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // verifica se possui permissão
      this._userService.verifyPermission(this.user.email, this.form.value.password).subscribe(permission => {
        if (permission) {
          // verifica se tem avatar e remove
          if (this.user.avatar)
            this._userService.deleteAvatar(this.user.avatar).subscribe();

          // remove o usuário
          this._userService.delete().subscribe(res => {
            // removido com sucesso
            Materialize.toast(this._translateService.instant('REMOVE-ACCOUNT-SUCCESS'), 5000);
            this._router.navigate(['/login']);
          }, (err) => {
            Materialize.toast(this._translateService.instant('ERROR-SERVER'), 5000);
          });
        }
      }, (err) => {
        if (err.status == 403)
          return Materialize.toast(this._translateService.instant('VALIDATION.PASSWORD-NOT-MATCH-APP'), 5000);

        Materialize.toast(this._translateService.instant('ERROR-SERVER'), 5000);
      });
    }
  }

}
