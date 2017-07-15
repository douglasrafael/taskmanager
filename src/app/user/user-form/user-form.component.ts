import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { UserService } from 'app/user/user.service';
import { ValidationService } from 'app/validation/validation.service';
import { ControlMessagesComponent } from 'app/validation/control-messages.component';
import { User } from 'app/user/user';

declare var Materialize: any;
declare var jQuery: any;

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  user: User;
  avatarUrl: SafeUrl;
  avatarFile: File;
  formProcessing: boolean;

  constructor(private _formBuilder: FormBuilder, private _userService: UserService, private _validationService: ValidationService,
    private _translate: TranslateService, private _router: Router, private _sanitizer: DomSanitizer, private _ng2ImgMaxService: Ng2ImgMaxService,
    private _location: Location) {
    this.formProcessing = false;
<<<<<<< HEAD
    this.avatarUrl = './assets/images/avatar.png';
=======
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
  }

  ngOnInit() {
    this.formBuild();

    if (this.user) return;

    // Pega os dados do usuário logado
    this._userService.getUserLogged().subscribe((res) => {
      this.user = new User(res);
      this.populaForm(this.user);
    });
  }

  /**
   * Realiza o mapeamento com componente com o form.
   * 
   * @memberOf UserFormComponent
   */
  formBuild(): void {
    this.userForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: '',
      email: ['', [Validators.required, this._validationService.emailValidator]]
    });
  }

  /**
   * Popula form com os dados do usuário.
   * 
   * @param {User} user 
   * 
   * @memberOf UserFormComponent
   */
  populaForm(user: User): void {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName != null ? user.lastName : '',
      email: user.email
    });

<<<<<<< HEAD
    /**
     * Popula o avatar do usuário, caso ele tenha cadastrado
     */
    if (this.user.avatar && this.user.avatar != '') {
      this._userService.getAvatar(this.user.avatar).subscribe(res => {
        this.avatarUrl = this._sanitizer.bypassSecurityTrustUrl(res.file);
      });
    }
=======
    if (this.user.avatar && this.user.avatar != '')
      this.avatarUrl = 'uploads/users/'.concat(this.user.avatar);
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

    Materialize.updateTextFields();
  }

  /**
   * Realiza o processo de para submter o formulário
   * Caso foi selecionado a imagem, o upload é realizado primeiro para depois fazer a submissão das informações.
   * 
   * @memberOf UserFormComponent
   */
  onSubmit() {
    this.formProcessing = true;
<<<<<<< HEAD
    let user = new User(this.userForm.value as User);
=======
    var user = new User(this.userForm.value as User);
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

    if (this.avatarFile) {
      let formData: FormData = new FormData();
      formData.append('avatar', this.avatarFile, this.avatarFile.name);

      this._userService.uploadAvatar(formData).subscribe((data) => {
<<<<<<< HEAD
        // remove o avatar antigo, caso tenha
        if (this.user.avatar)
          this.deleteAvatar(this.user.avatar);

=======
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
        // Após upload com sucesso seta no objeto user o filename que veio do back-end 
        user.avatar = data.file.filename;

        this.update(user);
      }, (error) => {
        return Materialize.toast(this._translate.instant('ERROR-UPLOAD-IMG'), 7000);
      });
    } else {
      this.update(user);
    }
  }

  /**
   * Atualiza dados do usuário.
   * 
   * @param {User} user 
   * 
   * @memberOf UserFormComponent
   */
  update(user: User) {
    this._userService.updateAllNotPassword(user)
      .subscribe(res => {
        if (res) { // verifica se o cadadtro foi realizado com sucesso
<<<<<<< HEAD
          this.user = new User(res);
          if(this.avatarFile) // atualiza a pagina apenas se tiver feito upload do avatar
            window.location.reload();

=======
          this.user = new User(res);          
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
          Materialize.toast(this._translate.instant('UPDATE-SUCCSESS'), 5000);
        }
      }, (err) => {
        if (this.avatarFile) // Como ocorreu um erro, a imagem que foi feita o upload deve ser removida
          this.deleteAvatar(user.avatar);

<<<<<<< HEAD
        if (JSON.parse(err._body).codeError === 11000) // erro retornado quando o email a ser cadastrastado já existe na base de dados
=======
        if (JSON.parse(err._body).codeError == 11000) // erro retornado quando o email a ser cadastrastado já existe na base de dados
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
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
   * @memberOf UserFormComponent
   */
  deleteAvatar(filename: string) {
    this._userService.deleteAvatar(filename).subscribe(res => res);
  }

  /**
   * Força o click no compoente input file.
   * 
   * @memberOf UserFormComponent
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
   * @memberOf UserFormComponent
   */
  handleSelectImage(event) {
    this.avatarFile = event.target.files[0];

    if (this.avatarFile) {
      // Redimensiona a imagem antes de fazer o upload
      this._ng2ImgMaxService.resizeImage(this.avatarFile, 250, 250).subscribe((result) => {
        this.avatarFile = result;
        this.avatarUrl = this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.avatarFile));
      }, error => { console.log(error) });
    } else {
      this.avatarFile = null;
      this.avatarUrl = null;
    }
  }

  /**
   * Volta para página anterior.
   * 
   * @memberOf UserFormComponent
   */
  doBack(): void {
    this._location.back();
  }
}
