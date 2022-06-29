import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWorkflowstepComponent } from './role_workflowstep.component';

describe('RoleWorkflowstepComponent', () => {
  let component: RoleWorkflowstepComponent;
  let fixture: ComponentFixture<RoleWorkflowstepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleWorkflowstepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWorkflowstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
