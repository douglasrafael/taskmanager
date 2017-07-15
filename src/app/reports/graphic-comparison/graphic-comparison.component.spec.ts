import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicComparisonComponent } from './graphic-comparison.component';

describe('GraphicComparisonComponent', () => {
  let component: GraphicComparisonComponent;
  let fixture: ComponentFixture<GraphicComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
