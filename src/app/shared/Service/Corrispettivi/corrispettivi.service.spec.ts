import { TestBed } from '@angular/core/testing';

import { CorrispettiviService } from './corrispettivi.service';

describe('CorrispettiviService', () => {
  let service: CorrispettiviService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrispettiviService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
