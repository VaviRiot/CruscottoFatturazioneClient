import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsolutiComponent } from './insoluti.component';

describe('InsolutiComponent', () => {
  let component: InsolutiComponent;
  let fixture: ComponentFixture<InsolutiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsolutiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsolutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
