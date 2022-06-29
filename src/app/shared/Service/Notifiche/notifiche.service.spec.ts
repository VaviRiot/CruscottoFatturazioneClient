import { TestBed } from '@angular/core/testing';

import { NotificheService } from './notifiche.service';

describe('NotificheService', () => {
  let service: NotificheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
