import { Title, BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { MaterializeModule } from 'angular2-materialize';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { UserService } from 'app/user/user.service';
import { TasksService } from 'app/tasks/tasks.service';
import { AppComponent } from 'app/app.component';
import { TasksComponent } from 'app/tasks/tasks.component';
import { LoginComponent } from 'app/login/login.component';
import { HomeComponent } from 'app/home/home.component';
import { AppRoutingModule } from 'app/app.routing.module';
import { AuthGuard } from 'app/guards/auth.guard';
import { TranslateRenderModule } from 'app/translate/translate.render.module';
import { ControlMessagesComponent } from 'app/validation/control-messages.component';
import { ValidationModule } from 'app/validation/validation.module';
import { SignupComponent } from 'app/signup/signup.component';
import { HeaderComponent } from 'app/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterializeModule,
    HttpModule,
    AppRoutingModule,
    TranslateRenderModule,
    ValidationModule,
    Ng2ImgMaxModule
  ],
  exports: [],
  providers: [
    AuthGuard,
    UserService,
    TasksService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
