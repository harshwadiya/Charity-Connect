import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Feedback } from '../models/feedback.model';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  sendFeedback(feedback: Feedback): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/Feedbacks`,
      feedback
    );
  }

  getAllFeedbacksByUserId(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/Feedbacks/user/${userId}`
    );
  }

  deleteFeedback(feedbackId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/api/Feedbacks/${feedbackId}`
    );
  }

  getFeedbacks(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/Feedbacks`
    );
  }
}