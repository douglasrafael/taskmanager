import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { GraphicProductivityComponent } from 'app/reports/graphic-productivity/graphic-productivity.component';
import { GraphicComparisonComponent } from './graphic-comparison/graphic-comparison.component';
import { GraphicTasksAddedComponent } from './graphic-tasks-added/graphic-tasks-added.component';

const reportsRoutes: Routes = [
    {
        path: '', data: { title: "reports" },
        children: [
            { path: 'productivity', component: GraphicProductivityComponent },
            { path: 'tasksadded', component: GraphicTasksAddedComponent },
            { path: 'comparison', component: GraphicComparisonComponent },
            { path: '', redirectTo: 'productivity' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(reportsRoutes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }
