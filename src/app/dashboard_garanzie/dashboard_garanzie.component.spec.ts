import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { dashboard_garanzieComponent } from './dashboard_garanzie.component';

describe('dashboard_garanzieComponent', () => {
  let component: dashboard_garanzieComponent;
  let fixture: ComponentFixture<dashboard_garanzieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ dashboard_garanzieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(dashboard_garanzieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
