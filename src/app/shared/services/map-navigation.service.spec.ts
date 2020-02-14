import { TestBed } from '@angular/core/testing';

import { MapNavigationService } from './map-navigation.service';

describe('MapNavigationService', () => {
  let service: MapNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
