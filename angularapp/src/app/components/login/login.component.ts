import { Component } from '@angular/core';
import { Login } from 'src/app/models/login.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginModel: Login = { Email: '', Password: '' };
  errorMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.loginModel).subscribe({
      next: () => {
        const role = this.authService.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.Message || err.error?.message  || 'Login failed. Please try again.';
      }
    });
  }
}


