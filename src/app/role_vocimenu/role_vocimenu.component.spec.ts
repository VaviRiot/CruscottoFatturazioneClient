import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleVocimenuComponent } from './role_vocimenu.component';

describe('RoleVocimenuComponent', () => {
  let component: RoleVocimenuComponent;
  let fixture: ComponentFixture<RoleVocimenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleVocimenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleVocimenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
