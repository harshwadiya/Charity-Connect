import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Chatbot/status`);
  }

  askBot(message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Chatbot/ask`, { message: message });
  }
}