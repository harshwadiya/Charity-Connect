import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit, OnDestroy {
  username: string = "";
  role: string = "User";
  showLogoutModal: boolean = false;
  showFeedbackDropdown: boolean = false;
  mobileMenuOpen: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || 'User';

    this.subscriptions.push(
      this.authService.role$.subscribe(role => {
        if (role) {
          this.role = role;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  confirmLogout(): void {
    this.showLogoutModal = true;
    this.mobileMenuOpen = false;
    this.showFeedbackDropdown = false;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');

    this.showLogoutModal = false;
  }

  toggleFeedbackDropdown(event: Event): void {
    event.stopPropagation();
    this.showFeedbackDropdown = !this.showFeedbackDropdown;
  }

  closeFeedbackDropdown(): void {
    this.showFeedbackDropdown = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.showFeedbackDropdown = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showFeedbackDropdown = false;
  }
}