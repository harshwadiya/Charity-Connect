import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../models/donation.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  public apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllDonations(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/donations`
    );
  }

  getDonationById(donationId: number): Observable<Donation> {
    return this.http.get<Donation>(
      `${this.apiUrl}/api/donations/${donationId}`
    );
  }

  addDonation(donation: Donation): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/donations`,
      donation
    );
  }

  updateDonation(donationId: number, donation: Donation): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/donations/${donationId}`,
      donation
    );
  }

  deleteDonation(donationId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/api/donations/${donationId}`
    );
  }

  getDonationsByUserId(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/donations/user/${userId}`
    );
  }

  getDonationsByCharityId(charityId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/donations/charity/${charityId}`
    );
  }
}