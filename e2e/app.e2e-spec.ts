import { TaskmanagerV1.2Page } from './app.po';

describe('taskmanager-v1.2 App', () => {
  let page: TaskmanagerV1.2Page;

  beforeEach(() => {
    page = new TaskmanagerV1.2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
