import { TranslateService } from 'ng2-translate';
import { TasksComponent } from './tasks.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TasksFormComponent } from './tasks-form/tasks-form.component';
import { TasksPrintComponent } from 'app/tasks//tasks-print/tasks-print.component';

const tasksRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'list/:p', component: TasksComponent, data: { title: "task-list" } },
            { path: 'edit/:id', component: TasksFormComponent, data: { title: 'task-edit' } },
            { path: 'create', component: TasksFormComponent, data: { title: 'task-create' } },
            { path: 'print', component: TasksPrintComponent, data: { title: 'task-print' } },
            { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(tasksRoutes)],
    exports: [RouterModule]
})
export class TasksRoutingModule { }

