import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSaleTirComponent } from './view_sale_tir.component';

describe('ViewSaleTirComponent', () => {
  let component: ViewSaleTirComponent;
  let fixture: ComponentFixture<ViewSaleTirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSaleTirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSaleTirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
