import { Languages } from './../shared/constants/languages.constant';
import { Http } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateStaticLoader, TranslateLoader, TranslateService } from 'ng2-translate';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

import * as moment from 'moment';

const translateConfig = {
  provide: TranslateLoader,
  useFactory: (createTranslateLoader),
  deps: [Http]
};

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot(translateConfig)
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    TranslateService
  ],
  declarations: []
})
export class TranslateRenderModule {
  browserLang: string;
  
  constructor(_translate: TranslateService) {
    // _translate.addLangs(languages); // linguagens disponíveis
    
    if (!localStorage.getItem('lang')) {
      this.browserLang = _translate.getBrowserLang();
      localStorage.setItem('lang', this.browserLang); // default
    }
    _translate.setDefaultLang(this.getLanguage());
    _translate.use(this.getLanguage());

    if (this.getLanguage() === 'pt')
      moment.locale('pt-br');
  }

  /**
   * Retorna a linguagem atual do sistema
   * 
   * @returns {string} 
   * 
   * @memberOf TranslateRenderModule
   */
  getLanguage(): string {
    let lang = localStorage.getItem('lang');

    if(lang.match(/en|pt/)) return lang;

    // caso não encontre linguagem ou não seja uma permitida dentre as permitdias
    // retorna a default
    return 'pt';
  }
}
