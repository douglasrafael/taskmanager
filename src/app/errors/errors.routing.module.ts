import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { NotFoundComponent } from './not-found/not-found.component';

const errorsRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '404', component: NotFoundComponent },
            { path: '', redirectTo: '404', pathMatch: 'prefix' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(errorsRoutes)],
    exports: [RouterModule]
})
export class ErrorsRoutingModule {
    constructor() {
    }
}
