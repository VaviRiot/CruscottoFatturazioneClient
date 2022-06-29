import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsGridComponent } from './notifications-grid.component';

describe('NotificationsGridComponent', () => {
  let component: NotificationsGridComponent;
  let fixture: ComponentFixture<NotificationsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
