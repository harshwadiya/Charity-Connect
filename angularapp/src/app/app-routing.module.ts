import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ErrorComponent } from './components/error/error.component';
import { AdminviewcharityComponent } from './components/adminviewcharity/adminviewcharity.component';
import { authGuard } from './components/authguard/auth.guard';
import { CreatecharityComponent } from './components/createcharity/createcharity.component';
import { ViewalldonationComponent } from './components/viewalldonation/viewalldonation.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { MydonationComponent } from './components/mydonation/mydonation.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewcharityComponent } from './components/userviewcharity/userviewcharity.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';   

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'error', component: ErrorComponent },

  // ============ Admin Routes ============
  {
    path: 'admin/dashboard',
    component: AdmindashboardComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/charities',
    component: AdminviewcharityComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/charities/create',
    component: CreatecharityComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/charities/edit/:id',
    component: CreatecharityComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/donations',
    component: ViewalldonationComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/feedback',
    component: AdminviewfeedbackComponent,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

  // ============ User Routes ============
  {
    path: 'user/dashboard',
    component: UserdashboardComponent,        
    canActivate: [authGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/charities',
    component: UserviewcharityComponent,
    canActivate: [authGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/mydonations',
    component: MydonationComponent,
    canActivate: [authGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/feedback',
    component: UserviewfeedbackComponent,
    canActivate: [authGuard],
    data: { role: 'User' }
  },
  {
    path: 'user/feedback/add',
    component: UseraddfeedbackComponent,
    canActivate: [authGuard],
    data: { role: 'User' }
  },

  // ============ Wildcard (must be last) ============
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 100]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }