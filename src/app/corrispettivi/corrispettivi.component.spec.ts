import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrispettiviComponent } from './corrispettivi.component';

describe('CorrispettiviComponent', () => {
  let component: CorrispettiviComponent;
  let fixture: ComponentFixture<CorrispettiviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrispettiviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrispettiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
