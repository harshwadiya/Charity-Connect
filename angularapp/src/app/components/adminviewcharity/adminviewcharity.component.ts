import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Charity } from 'src/app/models/charity.model';
import { CharityService } from 'src/app/services/charity.service';
import { DonationService } from 'src/app/services/donation.service';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-adminviewcharity',
  templateUrl: './adminviewcharity.component.html',
  styleUrls: ['./adminviewcharity.component.css']
})
export class AdminviewcharityComponent implements OnInit {

  charities: Charity[] = [];
  filteredCharities: Charity[] = [];      
  isLoading: boolean = true;

  searchTerm: string = '';                
  statusFilter: string = 'All';          

  totalDonation: number = 0;
  showDonationModel: boolean = false;

  constructor(
    private charityService: CharityService,
    private router: Router,
    private donationService: DonationService,
    private popup: PopupService
  ) {}

  ngOnInit() {
    this.loadCharities();
  }

  loadCharities() {
    this.isLoading = true;
    this.charityService.getAllCharities().subscribe({
      next: (data) => {
        this.charities = data;
        this.filteredCharities = data;       
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.popup.error('Failed to load charities');
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

  editCharity(charityId: number) {
    this.router.navigate(['/admin/charities/edit', charityId]);
  }

  deleteCharity(charityId: number) {
    this.popup.confirm(
      'Are you sure you want to delete this charity?',
      () => {
        this.charityService.deleteCharity(charityId).subscribe({
          next: () => {
            this.popup.success('Deleted Successfully!');
            this.loadCharities();
          },
          error: (error) => {
            console.error(error);
            this.popup.error('Failed to delete charity');
          }
        });
      }
    );
  }

  checkDonation(charityId: number): void {
    this.donationService.getDonationsByCharityId(charityId).subscribe({
      next: (response: any) => {
        let donations = response?.data;
        if (!donations) donations = [];
        if (!Array.isArray(donations)) donations = [];

        this.totalDonation = donations.reduce(
          (sum: number, d: any) => sum + d.amount, 0
        );
        this.showDonationModel = true;
      },
      error: (error) => {
        console.error(error);
        this.popup.error('Failed to fetch donations');
      }
    });
  }

  closeDonationModel(): void {
    this.showDonationModel = false;
  }
}