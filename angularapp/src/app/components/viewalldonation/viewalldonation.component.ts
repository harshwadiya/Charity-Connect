import { Component, OnInit } from '@angular/core';
import { DonationService } from 'src/app/services/donation.service';

@Component({
  selector: 'app-viewalldonation',
  templateUrl: './viewalldonation.component.html',
  styleUrls: ['./viewalldonation.component.css']
})
export class ViewalldonationComponent implements OnInit {

  donations: any[] = [];
  isLoading: boolean = true;

  constructor(private donationService: DonationService) { }

  ngOnInit(): void {
    this.loadAllDonations();
  }

  loadAllDonations(): void {
    this.donationService.getAllDonations().subscribe({
      next: (response: any) => {
        this.donations = response?.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error while fetching donations', error);
        this.donations = [];
        this.isLoading = false;
      }
    });
  }
}