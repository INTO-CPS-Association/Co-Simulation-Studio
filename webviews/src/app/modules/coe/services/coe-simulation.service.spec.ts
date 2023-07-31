import { TestBed } from '@angular/core/testing';

import { CoeSimulationService } from './coe-simulation.service';

describe('CoeSimulationService', () => {
  let service: CoeSimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoeSimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
