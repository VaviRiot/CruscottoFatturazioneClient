import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRoleVocimenuComponent } from './detail_role_vocimenu.component';

describe('DetailRoleVocimenuComponent', () => {
  let component: DetailRoleVocimenuComponent;
  let fixture: ComponentFixture<DetailRoleVocimenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRoleVocimenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRoleVocimenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
