import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader  } from 'ng2-translate';
import { MaterializeModule } from 'angular2-materialize';

import { UserService } from 'app/user/user.service';
import { ValidationService } from 'app/validation/validation.service';
import { UserRoutingModule } from 'app/user/user.routing.module';
import { TranslateRenderModule } from 'app/translate/translate.render.module';
import { ControlMessagesComponent } from 'app/validation/control-messages.component';
import { ValidationModule } from 'app/validation/validation.module';
import { UserFormComponent } from 'app/user/user-form/user-form.component';
import { MenuNavComponent } from 'app/user/menu-nav/menu-nav.component';
import { PasswordEditComponent } from './password-edit/password-edit.component';
import { RemoveAccountComponent } from './remove-account/remove-account.component';
import { ApplicationSettingsComponent } from './application-settings/application-settings.component';

@NgModule({
    declarations: [
        UserFormComponent,
        MenuNavComponent,
        PasswordEditComponent,
        RemoveAccountComponent,
        ApplicationSettingsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UserRoutingModule,
        TranslateRenderModule,
        ValidationModule,
        MaterializeModule
    ],
    exports: [],
    providers: [
        UserService,
        ValidationService
    ]
})
export class UserModule {}
