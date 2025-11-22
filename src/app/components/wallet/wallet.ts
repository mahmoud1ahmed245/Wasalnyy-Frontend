import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-wallet',
  imports: [FormsModule],
  templateUrl: './wallet.html',
  styles: ``,
})
export class Wallet {
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
