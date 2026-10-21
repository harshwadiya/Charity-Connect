import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, switchMap, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { environment } from '../environments/environment';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl = environment.apiUrl;

  private roleSubject = new BehaviorSubject<string>('');
  public role$ = this.roleSubject.asObservable();

  public userIdSubject = new BehaviorSubject<number>(0);
  public userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private crypto : CryptoService) { 
    this.loadTokenData();
  }

  register(user: User): Observable<any> {
    return from(this.crypto.encrypt(user.Password)).pipe(
      switchMap((encryptedPassword: string) => 
      {
        const payload = {
          ...user,
          Password: encryptedPassword
        };
        return this.http.post(`${this.apiUrl}/api/register`, payload);
      })
    )
  }

  login(login: Login): Observable<any> {
    return from(this.crypto.encrypt(login.Password)).pipe(
      switchMap((encryptedPassword: string )=> 
      {
        const payload = {
          Email : login.Email,
          Password: encryptedPassword,
          CaptchaToken: login.CaptchaToken
        };
        return this.http.post(`${this.apiUrl}/api/login`, payload)
      }),
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loadTokenData();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.roleSubject.next('');
    this.userIdSubject.next(0);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    return this.roleSubject.value;
  }

  getUserId(): number {
    return this.userIdSubject.value;
  }

  private loadTokenData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        
        this.roleSubject.next(role || '');
        this.userIdSubject.next(userId ? parseInt(userId, 10) : 0);
      }
      catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }

}
