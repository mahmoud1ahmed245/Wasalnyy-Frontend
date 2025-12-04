import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7229/api/admin'; 

  constructor(private http: HttpClient) { }

 
  getAllDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers`);
  }

  getDriverByLicense(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}`);
  }

  getDriverTripCount(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/${driverId}/trips/count`);
  }

  getDriverTrips(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/${driverId}/trips`);
  }

  getDriverSubmittedComplaints(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}/complaints/submitted`);
  }

  getDriverComplaintsAgainst(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}/complaints/against`);
  }

  getDriverRating(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}/rating`);
  }

  suspendDriver(license: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/drivers/license/${license}/suspend`, {});
  }

  // ============= RIDERS =============
  getAllRiders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders`);
  }

  getRiderByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/phone/${phone}`);
  }

  getRiderTripCount(riderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/${riderId}/trips/count`);
  }

  getRiderTrips(riderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/${riderId}/trips`);
  }

  getRiderTripsByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/phone/${phone}/trips`);
  }

  getRiderComplaintsByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/phone/${phone}/complaints`);
  }

  suspendRider(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/riders/${id}/suspend`, {});
  }

 
  getTripById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trips/${id}`);
  }

  getTripsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trips/status/${status}`);
  }


  getTotalCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/totals`);
  }

  getRidersCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/riders/count`);
  }

  getComplaintById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/complaints/${id}`);
  }
}