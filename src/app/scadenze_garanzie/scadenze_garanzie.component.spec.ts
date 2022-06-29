import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScadenzeGaranzieComponent } from './scadenze_garanzie.component';

describe('ScadenzeGaranzieComponent', () => {
  let component: ScadenzeGaranzieComponent;
  let fixture: ComponentFixture<ScadenzeGaranzieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScadenzeGaranzieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScadenzeGaranzieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
