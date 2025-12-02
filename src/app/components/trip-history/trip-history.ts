import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-trip-history',
  imports: [],
  templateUrl: './trip-history.html',
  styleUrl: `./trip-history.css`,
})
export class TripHistory {
  constructor(private authService:AuthService){}
  logout() {
    this.authService.logout();
  }
}
