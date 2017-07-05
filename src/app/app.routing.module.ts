import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from 'app/guards/auth.guard';
import { LoginComponent } from 'app/login/login.component';
import { SignupComponent } from 'app/signup/signup.component';
import { HomeComponent } from "app/home/home.component";

const appRoutes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [AuthGuard], canLoad: [AuthGuard],
        children: [
            { path: 'reports', loadChildren: 'app/reports/reports.module#ReportsModule' },
            { path: 'user', loadChildren: 'app/user/user.module#UserModule' },
            { path: 'tasks', loadChildren: 'app/tasks/tasks.module#TasksModule' }
        ]
    },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'error', loadChildren: 'app/errors/errors.module#ErrorsModule' },
    { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
