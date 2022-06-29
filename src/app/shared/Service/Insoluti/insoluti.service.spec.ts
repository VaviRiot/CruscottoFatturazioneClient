import { TestBed } from '@angular/core/testing';

import { InsolutiService } from './insoluti.service';

describe('InsolutiService', () => {
  let service: InsolutiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsolutiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
