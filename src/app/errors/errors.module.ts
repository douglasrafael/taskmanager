import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';

import { ErrorsRoutingModule } from './errors.routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { NoDataComponent } from 'app/errors/no-data/no-data.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    NoDataComponent
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    TranslateModule
  ],
  exports: [
    NoDataComponent
  ],
  providers: []
})
export class ErrorsModule {
  constructor() {
  }
}