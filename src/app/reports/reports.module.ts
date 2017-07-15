import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { TranslateModule } from 'ng2-translate';

import { ErrorsModule } from 'app/errors/errors.module';
import { TasksService } from 'app/tasks/tasks.service';
import { ReportsRoutingModule } from 'app/reports/reports.routing.module';
import { MenuNavComponent } from 'app/reports/menu-nav/menu-nav.component';
import { GraphicProductivityComponent } from './graphic-productivity/graphic-productivity.component';
import { GraphicTasksAddedComponent } from './graphic-tasks-added/graphic-tasks-added.component';
import { GraphicComparisonComponent } from './graphic-comparison/graphic-comparison.component';

@NgModule({
  declarations: [
    MenuNavComponent,
    MenuNavComponent,
    GraphicProductivityComponent,
    GraphicTasksAddedComponent,
    GraphicComparisonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    TranslateModule,
    ChartsModule,
    ErrorsModule
  ],
  providers: [TasksService]
})
export class ReportsModule { }
