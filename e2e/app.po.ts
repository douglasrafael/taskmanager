import { browser, by, element } from 'protractor';

<<<<<<< HEAD
export class TaskmanagerV1.2Page {
=======
export class TaskmanagerV.1.0Page {
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
