import { TestBed } from '@angular/core/testing';

import { CharityService } from './charity.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CharityService', () => {
  let service: CharityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CharityService);
  });

  fit('Frontend_should_create_charity_service', () => {
    expect(service).toBeTruthy();
  });
});
