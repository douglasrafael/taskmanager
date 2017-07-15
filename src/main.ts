import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

<<<<<<< HEAD
import { AppModule } from 'app/app.module';
import { environment } from 'environments/environment';
=======
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
