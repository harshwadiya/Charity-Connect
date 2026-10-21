import { Component, OnInit } from '@angular/core';
import { DonationService } from 'src/app/services/donation.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {

  userId: number = 0;
  username: string = 'User';

  isLoading: boolean = true;
  donations: any[] = [];

  constructor(
    private donationService: DonationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    const savedName = localStorage.getItem('username');
    if (savedName) {
      this.username = savedName;
    }

    if (this.userId > 0) {
      this.loadDashboardData();
    } else {
      this.isLoading = false;
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.donationService.getDonationsByUserId(this.userId).subscribe({
      next: (response: any) => {
        this.donations = response?.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Dashboard load error', error);
        this.donations = [];
        this.isLoading = false;
      }
    });
  }

  get uniqueCharitiesCount(): number {
    const ids = new Set(this.donations.map(d => d.charityId));
    return ids.size;
  }
  get totalDonationsCount(): number {
    return this.donations.length;
  }

  get totalMoneyDonated(): number {
    return this.donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  }
}