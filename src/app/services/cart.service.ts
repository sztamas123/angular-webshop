import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

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

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeTotals();
    }
  }
  
  remove(theCartItem: CartItem) {
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if(index > -1) {
      this.cartItems.splice(index, 1);
      this.computeTotals();
    }
  }
}
