import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angularapp';
  isLoggedIn = false;
  userRole : string = '';

  constructor(private authService : AuthService){}
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getRole();
      this.authService.role$.subscribe((role)=> 
      {
        this.userRole = role;
        this.isLoggedIn = this.authService.isLoggedIn();
      })
  }
}
