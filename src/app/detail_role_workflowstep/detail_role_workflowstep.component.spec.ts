import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRoleWorkflowstepComponent } from './detail_role_workflowstep.component';

describe('DetailRoleWorkflowstepComponent', () => {
  let component: DetailRoleWorkflowstepComponent;
  let fixture: ComponentFixture<DetailRoleWorkflowstepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRoleWorkflowstepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRoleWorkflowstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
