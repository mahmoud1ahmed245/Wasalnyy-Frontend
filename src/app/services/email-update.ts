import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailUpdateService {

  private authUrl = environment.apiUrl + '/Auth';
  private headers!: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {

    const token = this.authService.getToken();

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  updateEmail(newEmail: string): Observable<any> {
    const body = { newEmail };

    return this.http.post(
      `${this.authUrl}/update-email`,
      body,
      { headers: this.headers }
    );
  }
}
