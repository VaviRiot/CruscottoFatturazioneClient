import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInsolutiComponent } from './detail_insoluti.component';

describe('DetailInsolutiComponent', () => {
  let component: DetailInsolutiComponent;
  let fixture: ComponentFixture<DetailInsolutiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInsolutiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInsolutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
