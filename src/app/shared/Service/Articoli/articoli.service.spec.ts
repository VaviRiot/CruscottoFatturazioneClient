import { TestBed } from '@angular/core/testing';

import { ArticoliService } from './articoli.service';

describe('ArticoliService', () => {
  let service: ArticoliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticoliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
