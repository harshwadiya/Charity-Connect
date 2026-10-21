import { Component, OnInit } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { Charity } from 'src/app/models/charity.model';

import { DonationService } from 'src/app/services/donation.service';
import { CharityService } from 'src/app/services/charity.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mydonation',
  templateUrl: './mydonation.component.html',
  styleUrls: ['./mydonation.component.css']
})
export class MydonationComponent implements OnInit {

  donations: any[] = [];
  
  selectedCharity: Charity | null = null;

  showCharityModal: boolean = false;
  
  isLoading: boolean = false;

  userId: number = 0;

  constructor(
    private donationService: DonationService,
    private charityService: CharityService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId > 0) {
   this.loadMyDonations();
    }
  }

  loadMyDonations(): void {
    this.isLoading = true;
    this.donationService.getDonationsByUserId(this.userId).subscribe({
      next: (response: any) => {
        this.donations = response?.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading donations', error);
        this.donations = [];
        this.isLoading = false;
      }
    });
  }

  showCharity(Donation: any): void {
    if (Donation.charity) {
      this.selectedCharity = Donation.charity;
      this.showCharityModal = true;
    } else {
      this.charityService.getCharityById(Donation.charityId).subscribe({
        next: (response: any) => {
          this.selectedCharity = response?.data || response;
          this.showCharityModal = true;
        },
        error: (error) => {
          console.error('Error loading charity details', error);
        }
      });
    }
  }


  closeCharityModal(): void {
    this.showCharityModal = false;
    this.selectedCharity = null;
  }


  get totalDonated(): number {
    return this.donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  }
}