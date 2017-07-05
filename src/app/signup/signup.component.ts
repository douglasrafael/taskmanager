import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { UserService } from 'app/user/user.service';
import { ValidationService } from 'app/validation/validation.service';
import { ControlMessagesComponent } from 'app/validation/control-messages.component';
import { User } from 'app/user/user';

declare var Materialize: any;
declare var jQuery: any;

@Component({
  selector: 'app-singnup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userForm: FormGroup;
  avatarUrl: SafeUrl;
  avatarFile: File;
  formProcessing: boolean;

  constructor(private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _validationService: ValidationService,
    private _translate: TranslateService,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _ng2ImgMaxService: Ng2ImgMaxService) {
    this.formProcessing = false;
  }

  ngOnInit() {
    this.formBuild();
  }

  /**
   * Realiza o mapeamento com componente com o form.
   * 
   * @memberOf SignupComponent
   */
  formBuild(): void {
    this.userForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: '',
      email: ['', [Validators.required, this._validationService.emailValidator]],
      password: ['', [Validators.required, this._validationService.passwordValidator]],
      confirmPassword: ['', [Validators.required, this._validationService.passwordConfirm]],
      avatar: ''
    });
  }

  /**
   * Realiza o processo de cadastro de um novo usuário.
   * Caso foi selecionado a imagem, o upload é realizado primeiro para depois fazer o cadastro das informações.
   * 
   * @memberOf SignupComponent
   */
  signup() {
    this.formProcessing = true;
    var user = new User(this.userForm.value as User);

    if (this.avatarFile) {
      let formData: FormData = new FormData();
      formData.append('avatar', this.avatarFile, this.avatarFile.name);

      this._userService.uploadAvatar(formData).subscribe((data) => {
        // Após upload com sucesso seta no objeto user o filename que veio do back-end 
        user.avatar = data.file.filename;

        this.insert(user);
      }, (error) => {
        return Materialize.toast(this._translate.instant('ERROR-UPLOAD-IMG'), 7000);
      });
    } else {
      this.insert(user);
    }
  }

  /**
   * Insere um novo usuário no sistema.
   * 
   * @param {User} user 
   * 
   * @memberOf SignupComponent
   */
  insert(user: User) {
    this._userService.signup(user)
      .then(res => {
        if (res) // verifica se o cadadtro foi realizado com sucesso
          Materialize.toast(this._translate.instant('USER-REGISTERED'), 5000);

        this._router.navigate(['/login']); // se tudo ok redireciona para página de login
      }).catch((err) => {
        if (this.avatarFile) // Como ocorreu um erro, a imagem que foi feita o upload deve ser removida
          this.deleteAvatar(user.avatar);

        if (err.status == 400) // erro retornado quando o email a ser cadastrastado já existe na base de dados
          return Materialize.toast(this._translate.instant('VALIDATION.USER-ALREADY-REGISTERED'), 7000);

        return Materialize.toast(this._translate.instant('ERROR-SERVER'), 5000);
      });
      this.formProcessing = false;
  }

  /**
   * Remove o avatar de acordo com o filename.
   * 
   * @param {string} filename 
   * 
   * @memberOf SignupComponent
   */
  deleteAvatar(filename: string) {
    this._userService.deleteAvatar(filename).subscribe(res => res);
  }

  /**
   * Força o click no compoente input file.
   * 
   * @memberOf SignupComponent
   */
  openDialogImage() {
    jQuery('#imageUpload').click();
  }

  /**
   * Coloca a imagem selecionada no img preview
   * A imagem é redimensionada para fazer o upload.
   * 
   * @param {any} event 
   * 
   * @memberOf SignupComponent
   */
  handleSelectImage(event) {
    this.avatarFile = event.target.files[0];

    if (this.avatarFile) {
      // Redimensiona a imagem antes de fazer o upload
      this._ng2ImgMaxService.resizeImage(this.avatarFile, 250, 250).subscribe((result) => {
        this.avatarFile = result;
        this.avatarUrl = this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.avatarFile));
      }, error => { console.log(error); });
    } else {
      this.avatarFile = null;
      this.avatarUrl = null;
    }
  }
}
