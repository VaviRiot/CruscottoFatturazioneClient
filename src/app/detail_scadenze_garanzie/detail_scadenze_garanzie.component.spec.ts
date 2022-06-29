import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailScadenzeGaranzieComponent } from './detail_scadenze_garanzie.component';

describe('DetailScadenzeGaranzieComponent', () => {
  let component: DetailScadenzeGaranzieComponent;
  let fixture: ComponentFixture<DetailScadenzeGaranzieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailScadenzeGaranzieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailScadenzeGaranzieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
