import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Coordinates } from '../models/trip-request.dto';
import { OnInit } from '@angular/core';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class DriverHubService {
  baseUrl:string =environment.apiUrl + "/Driver";
  token:string ="";
  headers!:HttpHeaders;
 
  constructor(private http: HttpClient, private authService: AuthService) { 
    const token = this.authService.getToken();

    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
SetAsAvailable(coordinates: Coordinates){
   return this.http.post(this.baseUrl + `/SetAsAvailable`, {lat: Number(coordinates.Lat), lng: Number(coordinates.Lng)}, { headers: this.headers });


}
UpdateLocation(coordinates: Coordinates){
   return this.http.post(this.baseUrl + `/UpdateLocation`,  {lat: Number(coordinates.Lat), lng: Number(coordinates.Lng)}, { headers: this.headers });

}
AcceptTrip(tripId: string){

    return this.http.post(this.baseUrl+ `/AcceptTrip`, {tripId}, { headers: this.headers });

}
StartTrip(tripId: string){}
EndTrip(tripId: string){}
}
