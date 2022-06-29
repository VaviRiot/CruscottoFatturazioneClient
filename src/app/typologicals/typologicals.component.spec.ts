import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypologicalsComponent } from './typologicals.component';

describe('TypologicalsComponent', () => {
  let component: TypologicalsComponent;
  let fixture: ComponentFixture<TypologicalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypologicalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypologicalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
