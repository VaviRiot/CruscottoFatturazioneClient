import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailClienteComponent } from './detail-cliente.component';

describe('DetailClienteComponent', () => {
  let component: DetailClienteComponent;
  let fixture: ComponentFixture<DetailClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
