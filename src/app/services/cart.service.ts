import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {
    let alreadyInCart: boolean = false;
    let existingItem: CartItem = undefined!;

    if(this.cartItems.length > 0) {
      for(let tempCartItem of this.cartItems) {
        if(tempCartItem.id === theCartItem.id) {
          existingItem = tempCartItem;
          break;
        }
      }
      alreadyInCart = (existingItem != undefined);
    }
    if(alreadyInCart) {
      existingItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.computeTotals();
  }


  computeTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }
    //publish values so all subscibers get these data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
