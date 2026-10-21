import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent {
  showLogoutModal = false;

  constructor(private authService: AuthService, private router: Router) {}

  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }
}