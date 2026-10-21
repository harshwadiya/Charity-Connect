import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent {
  userModel: User = {
    Email: '',
    Password: '',
    Username: '',
    MobileNumber: '',
    UserRole: 'User',
    CaptchaToken: ''
  };
  successMessage = '';
  errorMessage = '';
  showPassword = false;
 
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.authService.register(this.userModel).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.Message || err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
 
 