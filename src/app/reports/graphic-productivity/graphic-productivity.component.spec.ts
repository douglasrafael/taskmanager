import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicProductivityComponent } from './graphic-productivity.component';

describe('GraphicProductivityComponent', () => {
  let component: GraphicProductivityComponent;
  let fixture: ComponentFixture<GraphicProductivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicProductivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
