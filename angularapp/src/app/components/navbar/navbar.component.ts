import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isScrolled = false;
  isLoggedIn = false;
  showLogoutModal = false;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 30;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  confirmLogout(): void {
    this.showLogoutModal = true;
    this.mobileMenuOpen = false;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.showLogoutModal = false;
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}