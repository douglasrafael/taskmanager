import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPrintComponent } from './tasks-print.component';

describe('TasksPrintComponent', () => {
  let component: TasksPrintComponent;
  let fixture: ComponentFixture<TasksPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
