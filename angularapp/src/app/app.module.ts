import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatecharityComponent } from './components/createcharity/createcharity.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MydonationComponent } from './components/mydonation/mydonation.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UsernavComponent } from './components/usernav/usernav.component';
import { UserviewcharityComponent } from './components/userviewcharity/userviewcharity.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { ViewalldonationComponent } from './components/viewalldonation/viewalldonation.component';
import { AdminviewcharityComponent } from './components/adminviewcharity/adminviewcharity.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { AdminnavComponent } from './components/adminnav/adminnav.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { PopupComponent } from './shared/popup/popup.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    CreatecharityComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    MydonationComponent,
    NavbarComponent,
    RegistrationComponent,
    UseraddfeedbackComponent,
    UsernavComponent,
    UserviewcharityComponent,
    UserviewfeedbackComponent,
    ViewalldonationComponent,
    AdminviewcharityComponent,
    AdminviewfeedbackComponent,
    AdminnavComponent,
    ChatbotComponent,
    PopupComponent,
    AdmindashboardComponent,
    UserdashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
