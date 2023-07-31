import { TestBed } from '@angular/core/testing';

import { SigverConfigurationService } from './sigver-configuration.service';

describe('SigverConfigurationService', () => {
  let service: SigverConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigverConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
