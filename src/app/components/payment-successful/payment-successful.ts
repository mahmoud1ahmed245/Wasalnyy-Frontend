import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-successful',
  imports: [],
  templateUrl: './payment-successful.html',
  styles: ``,
})
export class PaymentSuccessful {
  paymentId:string|null='';
  paymentAmount:string|null='';
  
constructor(private route: ActivatedRoute,private router:Router) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const sessionId = params['session_id'];
    const rideId = params['rideId'];
    const amount = params['amount'];

    this.paymentId=sessionId;
    this.paymentAmount=amount;
    console.log("Session:", sessionId);
    console.log("Ride:", rideId);
    console.log("Amount:", amount);
    setTimeout(() => {
      this.router.navigate(['/rider-dashboard']);
    }, 5000);
  });
}

}
