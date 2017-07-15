import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class ValidationService {

  constructor(private _translateService: TranslateService) { }

  /**
   * Recupera a mensagem de validação de acordo com os parâmetros 
   */
  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      required: this._translateService.instant('VALIDATION.REQUIRED'),
      invalidEmail: this._translateService.instant('VALIDATION.EMAIL'),
      invalidPassword: this._translateService.instant('VALIDATION.PASSWORD'),
      invalidDate: this._translateService.instant('VALIDATION.DATE-INVALID'),
      minlength: this._translateService.instant('VALIDATION.MIN-LENGTH', { param: validatorValue.requiredLength }),
      maxlength: this._translateService.instant('VALIDATION.MAX-LENGTH', { param: validatorValue.requiredLength }),
      confirmPassword: this._translateService.instant('VALIDATION.PASSWORD-NOT-MATCH'),
      // `minlength: Minimum length ${validatorValue.requiredLength}`,
    };

    return config[validatorName];
  }

  /**
   * Valida email 
   */
  emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/))
      return null;

    return { invalidEmail: true };
  }

  /**
   * Valida campo password que deverá ter: 6 caracteres pelo menos uma letra e 2 numeros 
   */
  passwordValidator(control) {
    // (?=(.*\d){2}) - diz que a senha deve conter pelo menos 2 dígitos
    // (?=.*[a-zA-Z]) - diz que a senha deve conter um alfa
    // (?=.*[!@#$%]) - diz que a senha deve conter 1 ou mais caracteres especiais que são definidos
    // [0-9a-zA-Z!@#*&$%] - determina os caracteres permitidos
    // {6,} - diz que a senha deve ter no mínimo 6 caracteres
    if (control.value.match((/^(?=(.*\d){2})(?=.*[a-zA-Z])[0-9a-zA-Z!@#*&$%]{6,}/)))
      return null;

    return { invalidPassword: true };
  }

  /**
   * Verifica se o campo de confirma password é igual ao campo password.
   * 
   * @param {any} control 
   * @returns 
   * 
   * @memberOf ValidationService
   */
  passwordConfirm(control) {
    let otherControl: FormControl;

    if (!control.parent)
      return null;

    otherControl = control.parent.get('password') as FormControl;
    if (otherControl.value === control.value)
      return null;

    return { confirmPassword: true };
  }

  /**
   * Valida data no formato yyyy-mm-dd.
   * Faz com que o dia esteja dentro do alcance válido para o mês:
   * - NÃO valida em 29 de fevereiro em um ano bissexto, apenas que fevereiro pode ter 29 dias
   * 
   * @param {any} control 
   * @returns 
   * 
   * @memberOf ValidationService
   */
  dateValidator(control) {
    if (control.value && control.value.match((/((19|20)\d\d)-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/)))
      return null;

    return { invalidDate: true };
  }
}
