import { TaskmanagerV.1.0Page } from './app.po';

describe('taskmanager-v.1.0 App', () => {
  let page: TaskmanagerV.1.0Page;

  beforeEach(() => {
    page = new TaskmanagerV.1.0Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
