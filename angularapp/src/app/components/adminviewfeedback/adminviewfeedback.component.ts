import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../models/feedback.model';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  errorMessage = '';
  isLoading = false;

  showUserModal = false;
  selectedUser: any = null;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getFeedbacks().subscribe({
      next: (data: any) => {
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.data)) {
          list = data.data;
        } else if (data && Array.isArray(data.$values)) {
          list = data.$values;
        }

        this.feedbacks = list.map((f: any) => {
          const rawUser = f.User || f.user || null;
          return {
            feedbackId: f.FeedbackId ?? f.feedbackId ?? null,
            userId: f.UserId ?? f.userId ?? null,
            feedbackText: f.FeedbackText ?? f.feedbackText ?? '',
            date: f.Date ?? f.date ?? null,
            user: rawUser ? {
              userId: rawUser.UserId ?? rawUser.userId ?? null,
              username: rawUser.Username ?? rawUser.username ?? null,
              email: rawUser.Email ?? rawUser.email ?? null,
              mobileNumber: rawUser.MobileNumber ?? rawUser.mobileNumber ?? null
            } : null
          };
        });

        this.isLoading = false;
        console.log('[FEEDBACK] Loaded:', this.feedbacks);
      },
      error: (err) => {
        this.errorMessage = err.error?.Message || 'Failed to load feedback';
        this.feedbacks = [];
        this.isLoading = false;
      }
    });
  }

  viewUserProfile(feedback: any): void {
    this.selectedUser = feedback.user || { userId: feedback.userId };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }
}