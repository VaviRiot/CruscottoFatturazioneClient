import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCorrispettivoComponent } from './detail-corrispettivo.component';

describe('DetailCorrispettivoComponent', () => {
  let component: DetailCorrispettivoComponent;
  let fixture: ComponentFixture<DetailCorrispettivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCorrispettivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCorrispettivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
