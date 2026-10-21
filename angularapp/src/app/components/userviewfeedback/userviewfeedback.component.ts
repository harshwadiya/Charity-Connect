import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {

  feedbacks: Feedback[] = [];
  isLoading: boolean = true;

  showDeletePopup = false;
  selectedFeedbackId: number = 0;

  loggedInUserId: number = 0;

  constructor(private feedbackService: FeedbackService) { }

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

    if (this.loggedInUserId && this.loggedInUserId !== 0) {
      this.loadFeedbacks();
    } else {
      this.isLoading = false;
    }
  }

  getUserIdFromToken(): number {

    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

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

  loadFeedbacks(): void {

    this.isLoading = true;

    this.feedbackService
      .getAllFeedbacksByUserId(this.loggedInUserId.toString())
      .subscribe({
        next: (response: any) => {
          console.log('Feedbacks Response:', response);

          // ✅ data ya direct array dono handle karo
          const list = response?.data || response || [];

          // ✅ har feedback ka ID normalize karo (koi bhi field name ho)
          this.feedbacks = list.map((f: any) => ({
            ...f,
            feedbackId: f.feedbackId ?? f.id ?? f.FeedbackId ?? f.Id
          }));

          this.isLoading = false;
        },
        error: (err) => {
          console.log('Load Feedbacks Error:', err);
          this.isLoading = false;
        }
      });
  }

  openDeletePopup(feedbackId: number): void {
    this.selectedFeedbackId = feedbackId;
    this.showDeletePopup = true;
  }

  cancelDelete(): void {
    this.showDeletePopup = false;
  }

  confirmDelete(): void {

    // ✅ safety check — galat ID pe delete mat bhejo
    if (!this.selectedFeedbackId || this.selectedFeedbackId === 0) {
      console.error('❌ Invalid feedback ID:', this.selectedFeedbackId);
      alert('Invalid feedback ID — check console for response field name.');
      this.showDeletePopup = false;
      return;
    }

    console.log('🗑️ Deleting feedback ID:', this.selectedFeedbackId);

    this.feedbackService
      .deleteFeedback(this.selectedFeedbackId.toString())
      .subscribe({
        next: () => {

          this.feedbacks = this.feedbacks.filter(
            feedback => feedback.feedbackId !== this.selectedFeedbackId
          );

          this.showDeletePopup = false;
          console.log('✅ Deleted successfully');
        },
        error: (err) => {
          console.error('Delete Error:', err);
          alert('Failed to delete: ' + (err.error?.message || err.message));
          this.showDeletePopup = false;
        }
      });
  }

}