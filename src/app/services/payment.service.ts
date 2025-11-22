import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  baseUrl=`${environment.apiUrl}/payment`;
  constructor(private http: HttpClient) {}
  MakePayment(amount:number){
    let rideId='123456';
    return this.http.post(`${this.baseUrl}/create-session`,amount);
  }
  
}
