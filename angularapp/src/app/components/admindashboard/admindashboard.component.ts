import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CharityService } from 'src/app/services/charity.service';
import { DonationService } from 'src/app/services/donation.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {

  // Metric values
  totalCharities: number = 0;
  totalDonations: number = 0;
  totalFeedback: number = 0;
  activeCharities: number = 0;
  thisMonthDonations: number = 0;

  isLoading: boolean = true;

  constructor(
    private charityService: CharityService,
    private donationService: DonationService,
    private feedbackService: FeedbackService,
    private router: Router,
    private popup: PopupService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    forkJoin({
      charities: this.charityService.getAllCharities(),
      donations: this.donationService.getAllDonations(),
      feedback: this.feedbackService.getFeedbacks()
    }).subscribe({
      next: (res: any) => {

        const charities = res.charities?.data ?? res.charities ?? [];
        const donations = res.donations?.data ?? res.donations ?? [];
        const feedback = res.feedback?.data ?? res.feedback ?? [];

        this.totalCharities = charities.length;

        this.activeCharities = charities.filter(
          (c: any) => c.status === 'Active'
        ).length;


        this.totalDonations = donations.reduce(
          (sum: number, d: any) => sum + (d.amount || 0), 0
        );

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        this.thisMonthDonations = donations
          .filter((d: any) => {
            if (!d.donationDate) return false;
            const dDate = new Date(d.donationDate);
            return dDate.getMonth() === currentMonth &&
                   dDate.getFullYear() === currentYear;
          })
          .reduce((sum: number, d: any) => sum + (d.amount || 0), 0);


        this.totalFeedback = feedback.length;

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.popup.error('Failed to load dashboard stats');
      }
    });
  }
}