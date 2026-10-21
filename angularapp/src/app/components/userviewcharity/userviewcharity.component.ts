import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Charity } from 'src/app/models/charity.model';
import { Donation } from 'src/app/models/donation.model';
import { CharityService } from 'src/app/services/charity.service';
import { DonationService } from 'src/app/services/donation.service';
import { PopupService } from 'src/app/shared/popup/popup.service';


@Component({
  selector: 'app-userviewcharity',
  templateUrl: './userviewcharity.component.html',
  styleUrls: ['./userviewcharity.component.css']
})
export class UserviewcharityComponent implements OnInit {

  charities: Charity[] = [];
  filteredCharities: Charity[] = [];
  isLoading: boolean = true;

  showDonateModal: boolean = false;
  selectedCharity: Charity | null = null;
  donationAmount: number = 0;

  searchTerm: string = '';
  statusFilter: string = 'All';

  loggedInUserId: number = 0;

  constructor(
    private charityService: CharityService,
    private donationService: DonationService,
    private router: Router,
    private popup: PopupService
  ) { }

  ngOnInit(): void {

    const directUserId =
      localStorage.getItem('userId') ||
      localStorage.getItem('UserId') ||
      localStorage.getItem('user_id');

    if (directUserId) {
      this.loggedInUserId = Number(directUserId);
    } else {
      this.loggedInUserId = this.getUserIdFromToken();
    }

    console.log('Logged In User ID:', this.loggedInUserId);

    this.loadCharities();
  }

  getUserIdFromToken(): number {

    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      console.log('JWT Payload:', payload);

      const userId =
        payload.userId ||
        payload.UserId ||
        payload.user_id ||
        payload.sub ||
        payload.nameid ||
        payload.id ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      return userId ? Number(userId) : 0;

    } catch (err) {
      console.error('Token decode error:', err);
      return 0;
    }
  }

  loadCharities(): void {
    this.charityService.getAllCharities().subscribe({
      next: (data) => {
        this.charities = data;
        this.filteredCharities = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Load Charities Error:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let result = this.charities;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(c =>
        c.charityName?.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter !== 'All') {
      result = result.filter(c => c.status === this.statusFilter);
    }

    this.filteredCharities = result;
  }

   clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.filteredCharities = this.charities;
  }

  openDonateModal(charity: Charity): void {
    if (charity.status === 'Active') {
      this.selectedCharity = charity;
      this.donationAmount = 0;
      this.showDonateModal = true;
    }
  }

  closeDonateModal(): void {
    this.showDonateModal = false;
    this.selectedCharity = null;
    this.donationAmount = 0;
  }

  submitDonation(): void {

    if (this.donationAmount <= 0) {
      this.popup.error('Please enter a valid donation amount.');

      return;
    }

    if (!this.selectedCharity) {
      this.popup.error('Invalid charity selected.');
      return;
    }

    if (!this.loggedInUserId || this.loggedInUserId === 0) {
      this.popup.error('User not logged in properly. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    const charityId = this.selectedCharity.charityId;

    if (!charityId) {
      this.popup.error('Charity ID not found.');
      return;
    }

    const donation: Donation = {
      userId: this.loggedInUserId,
      charityId: charityId,
      amount: this.donationAmount,
      donationDate: new Date()
    };

    console.log('Donation Payload:', donation);

    this.donationService.addDonation(donation).subscribe({
      next: (response) => {
        console.log('Donation Response:', response);
        this.popup.success('Donation successful!')
        this.closeDonateModal();
      },
      error: (error) => {
        console.error('Donation Error:', error);
        const errMsg =
          error.error?.message ||
          error.error?.title ||
          error.message ||
          'Unknown error';
        this.popup.error('Donation failed: ' + errMsg)
      }
    });
  }
}