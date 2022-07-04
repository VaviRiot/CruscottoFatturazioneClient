import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLogFatturaComponent } from './view-log-fattura.component';

describe('ViewLogFatturaComponent', () => {
  let component: ViewLogFatturaComponent;
  let fixture: ComponentFixture<ViewLogFatturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLogFatturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLogFatturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
