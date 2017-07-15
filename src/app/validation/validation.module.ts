import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ControlMessagesComponent } from './control-messages.component';
import { ValidationService } from './validation.service';

@NgModule({
    declarations: [ControlMessagesComponent],
    imports: [CommonModule],
    exports: [ControlMessagesComponent],
    providers: [ValidationService]
})
export class ValidationModule { }
