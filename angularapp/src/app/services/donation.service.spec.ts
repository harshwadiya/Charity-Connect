import { TestBed } from '@angular/core/testing';

import { DonationService } from './donation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DonationService', () => {
  let service: DonationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DonationService);
  });

  fit('Frontend_should_create_donation_service', () => {
    expect(service).toBeTruthy();
  });
});
