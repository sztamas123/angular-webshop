import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInformation } from '../common/payment-information';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = environment.webshopApiUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.webshopApiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) { }

  createOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInformation: PaymentInformation): Observable<any> {
    return this.httpClient.post<PaymentInformation>(this.paymentIntentUrl, paymentInformation);
  }
}
