import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFatturaComponent } from './detail-fattura.component';

describe('DetailFatturaComponent', () => {
  let component: DetailFatturaComponent;
  let fixture: ComponentFixture<DetailFatturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFatturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFatturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
