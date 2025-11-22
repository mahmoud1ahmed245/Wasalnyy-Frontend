import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { SignalrServiceTs } from '../../services/signalr.service.ts';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-dashboard',
  imports: [],
  templateUrl: './driver-dashboard.html',
  styles: ``,
})
export class DriverDashboard implements OnInit {
    constructor(private authService: AuthService, private router: Router, private signalrService: SignalrServiceTs) {}

ngOnInit(): void {

  this.signalrService.startConnection();
}

setAvailable(){
this.router.navigate(['/driver-map']);

}
goToWallet(){
    this.router.navigate(['/wallet']);
  }
  logout() {
    this.authService.logout();
  }

}
