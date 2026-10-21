import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Charity } from '../models/charity.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CharityService {
  public apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllCharities(): Observable<Charity[]> {
    return this.http.get<Charity[]>(`${this.apiUrl}/api/charities`);
  }
  getCharityById(charityId: number): Observable<Charity> {
    return this.http.get<Charity>(`${this.apiUrl}/api/charities/${charityId}`);
  }
  addCharity(charity: Charity): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/charities`, charity);
  }
  updateCharity(charityId: number, charity: Charity): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/charities/${charityId}`, charity);
  }
  deleteCharity(charirtyId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/charities/${charirtyId}`);
  }
}
