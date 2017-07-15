import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicTasksAddedComponent } from './graphic-tasks-added.component';

describe('GraphicTasksAddedComponent', () => {
  let component: GraphicTasksAddedComponent;
  let fixture: ComponentFixture<GraphicTasksAddedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicTasksAddedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicTasksAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
