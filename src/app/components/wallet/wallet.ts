import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-wallet',
  imports: [FormsModule,CurrencyPipe],
  templateUrl: './wallet.html',
  styleUrl: `./wallet.css`,
})
export class Wallet implements OnInit {
   paymentValue:number=0;
   paymentMode:boolean=false;
   role:string=''
   WalletBalance:number=0;
   constructor(private paymentService: PaymentService,private authService:AuthService
    ,private router:Router) {}
    ngOnInit(): void {
      this.role=this.authService.getRole()!;
      this.paymentService.getBalance().subscribe({next:(res:any)=>this.WalletBalance=res.balance,error:err=>console.error(err)})
    }
   togglePaymentMode(){
    this.paymentMode=!this.paymentMode;
   }
   makePayment(){
    this.paymentService.MakePayment(this.paymentValue).subscribe((res:any) => {
      window.location.href = res.url;
      console.log('Payment successful', res);
    }, error => {
      console.error('Payment failed', error);
    });
  }
        backToDashboard(){
          this.router.navigate(['./dashboard'])
        }
         logout() {
          this.authService.logout();
        }

}
