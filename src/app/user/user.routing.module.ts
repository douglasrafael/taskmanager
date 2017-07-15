import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFormComponent } from 'app/user/user-form/user-form.component';
import { PasswordEditComponent } from 'app/user/password-edit/password-edit.component';
import { RemoveAccountComponent } from 'app/user/remove-account/remove-account.component';
import { ApplicationSettingsComponent } from 'app/user/application-settings/application-settings.component';

const userRoutes: Routes = [
    {
        path: '',
        children: [
            { path: 'edit', component: UserFormComponent, data: { title: 'user-edit' } },
            { path: 'remove', component: RemoveAccountComponent, data: { title: 'user-remove' } },
            { path: 'password', component: PasswordEditComponent, data: { title: 'user-password' } },
            { path: 'app/settings', component: ApplicationSettingsComponent, data: { title: 'user-app-settings' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
