import { TestBed } from '@angular/core/testing';

import { MaestroApiService } from './maestro-api.service';

describe('MaestroApiService', () => {
  let service: MaestroApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaestroApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
