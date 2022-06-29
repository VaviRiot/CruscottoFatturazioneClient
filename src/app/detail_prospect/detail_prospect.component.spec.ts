import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProspectComponent } from './detail_prospect.component';

describe('DetailProspectComponent', () => {
  let component: DetailProspectComponent;
  let fixture: ComponentFixture<DetailProspectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProspectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
