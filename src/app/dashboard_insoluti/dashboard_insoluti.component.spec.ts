import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard_insolutiComponent } from './dashboard_insoluti.component';

describe('Dashboard_insolutiComponent', () => {
  let component: Dashboard_insolutiComponent;
  let fixture: ComponentFixture<Dashboard_insolutiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dashboard_insolutiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dashboard_insolutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
