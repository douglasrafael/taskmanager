<<<<<<< HEAD
import { TaskmanagerV1.2Page } from './app.po';

describe('taskmanager-v1.2 App', () => {
  let page: TaskmanagerV1.2Page;

  beforeEach(() => {
    page = new TaskmanagerV1.2Page();
=======
import { TaskmanagerV.1.0Page } from './app.po';

describe('taskmanager-v.1.0 App', () => {
  let page: TaskmanagerV.1.0Page;

  beforeEach(() => {
    page = new TaskmanagerV.1.0Page();
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
