import { TestBed } from '@angular/core/testing';

import { RpsService } from './rps.service';

describe('RpsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RpsService = TestBed.get(RpsService);
    expect(service).toBeTruthy();
  });
});
