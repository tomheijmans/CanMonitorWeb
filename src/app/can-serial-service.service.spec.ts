import { TestBed } from '@angular/core/testing';

import { CanSerialServiceService } from './can-serial-service.service';

describe('CanSerialServiceService', () => {
  let service: CanSerialServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanSerialServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
