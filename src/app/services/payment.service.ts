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
    return this.http.post(`${this.baseUrl}/create-session`,amount);
  }
  
}
