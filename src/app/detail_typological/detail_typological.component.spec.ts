import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTypologicalComponent } from './detail_typological.component';

describe('DetailTypologicalComponent', () => {
  let component: DetailTypologicalComponent;
  let fixture: ComponentFixture<DetailTypologicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTypologicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTypologicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
