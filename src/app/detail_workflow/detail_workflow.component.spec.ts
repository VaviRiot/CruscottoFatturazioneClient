import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailWorkflowComponent } from './detail_workflow.component';

describe('DetailWorkflowComponent', () => {
  let component: DetailWorkflowComponent;
  let fixture: ComponentFixture<DetailWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
