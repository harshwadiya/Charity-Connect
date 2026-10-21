import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {

  feedback: Feedback = new Feedback();
  submitted: boolean = false;
  showPopup: boolean = false;
  loggedInUserId: number = 0;

  constructor(private feedbackService: FeedbackService, private router: Router) { }

  ngOnInit(): void {

    const directUserId =
      localStorage.getItem('userId') ||
      localStorage.getItem('UserId');

    if (directUserId) {
      this.loggedInUserId = Number(directUserId);
    } else {
      this.loggedInUserId = this.getUserIdFromToken();
    }

    console.log('Logged In User ID:', this.loggedInUserId);
  }

  getUserIdFromToken(): number {

    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      console.log('JWT Payload:', payload);

      return Number(
        payload.userId ||
        payload.UserId ||
        payload.sub ||
        payload.nameid ||
        payload.id ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        0
      );
    } catch (err) {
      console.error('Token decode error:', err);
      return 0;
    }
  }

  onSubmit(): void {

    this.submitted = true;

    if (!this.feedback.feedbackText || !this.feedback.feedbackText.trim()) {
      return;
    }

    if (!this.loggedInUserId || this.loggedInUserId === 0) {
      alert('User not logged in properly. Please login again.');
      return;
    }

    this.feedback.UserId = this.loggedInUserId;
    this.feedback.date = new Date();

    console.log('Feedback Payload:', this.feedback);

    this.feedbackService.sendFeedback(this.feedback).subscribe({
      next: () => {
        this.showPopup = true;
        this.feedback = new Feedback();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Feedback Error:', err);
        alert('Failed to submit feedback: ' + (err.error?.message || err.message));
      }
    });
  }

  closePopup(): void {
    this.showPopup = false;
    this.router.navigate(['/user/feedback']);
  }
}