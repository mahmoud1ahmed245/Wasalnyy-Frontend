import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: `./profile.css`,
})
export class Profile {
    constructor(private authService:AuthService){}
  logout() {
    this.authService.logout();
  }
}
