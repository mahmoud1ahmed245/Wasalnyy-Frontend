import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterDriverComponent } from './components/register/register';
import { RegisterRider } from './components/register-rider/register-rider';
import { ChooseUserComponent } from './components/reg-option/reg-option';
import { FaceScan } from './components/face-scan/face-scan';
import { DriverDashboard } from './components/driver-dashboard/driver-dashboard';
import { RiderDashboard } from './components/rider-dashboard/rider-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'choose-user-type', pathMatch: 'full' },
  { path: 'login/:role', component: LoginComponent },
  { path: 'choose-user-type', component: ChooseUserComponent ,pathMatch:'full'},
  { path: 'register-driver', component: RegisterDriverComponent },
  { path: 'register-rider', component: RegisterRider },
  { path: 'face-scan/register/:userId', component: FaceScan },
  { path: 'face-scan/login', component: FaceScan },
  {path: 'driver-dashboard', component: DriverDashboard},
  {path: 'rider-dashboard', component: RiderDashboard},
  {path: '**', redirectTo: 'choose-user-type' }
];
