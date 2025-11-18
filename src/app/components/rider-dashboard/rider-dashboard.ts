import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-rider-dashboard',
  imports: [FormsModule],
  templateUrl: './rider-dashboard.html',
  styles: ``,
})
export class RiderDashboard {
paymentValue:number=0;
  constructor(private paymentService: PaymentService) {}

  makePayment(){
    this.paymentService.MakePayment(this.paymentValue).subscribe((res:any) => {
      window.location.href = res.url;
      console.log('Payment successful', res);
    }, error => {
      console.error('Payment failed', error);
    });
  }
}
