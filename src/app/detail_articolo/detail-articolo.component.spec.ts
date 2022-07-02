import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticoloComponent } from './detail-articolo.component';

describe('DetailArticoloComponent', () => {
  let component: DetailArticoloComponent;
  let fixture: ComponentFixture<DetailArticoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailArticoloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailArticoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
