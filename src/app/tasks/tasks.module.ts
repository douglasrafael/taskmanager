import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { MasonryModule } from 'angular2-masonry';

import { TasksService } from 'app/tasks/tasks.service';
import { TasksComponent } from 'app/tasks/tasks.component';
import { TasksFormComponent } from 'app/tasks/tasks-form/tasks-form.component';
import { ValidationModule } from 'app/validation/validation.module';
import { TranslateRenderModule } from 'app/translate/translate.render.module';
import { TasksRoutingModule } from "app/tasks/tasks.routing.module";
import { ValidationService } from 'app/validation/validation.service';
import { SearchFilterPipe } from 'app/shared/pipes/searchfilter.pipe';
import { ErrorsModule } from 'app/errors/errors.module';
import { TasksPrintComponent } from './tasks-print/tasks-print.component';

@NgModule({
    declarations: [
        TasksFormComponent,
        TasksComponent,
        SearchFilterPipe,
        TasksPrintComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TasksRoutingModule,
        TranslateRenderModule,
        ValidationModule,
        MaterializeModule,
        MasonryModule,
        ErrorsModule
    ],
    exports: [],
    providers: [TasksService, ValidationService, { provide: Window, useValue: window }]
})
export class TasksModule { }
