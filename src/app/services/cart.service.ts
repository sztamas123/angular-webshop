import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  storage: Storage = sessionStorage;
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'));
    if(data != null) {
      this.cartItems = data;
      this.calculateTotals();
    }
  }

  addItemToCart(cartItem: CartItem) {
    let alreadyInCart: boolean = false;
    let existingItem: CartItem = undefined!;

    if(this.cartItems.length > 0) {
      for(let tempCartItem of this.cartItems) {
        if(tempCartItem.id === cartItem.id) {
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
      this.cartItems.push(cartItem);
    }
    this.calculateTotals();
  }


  calculateTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }
    //publish values so all subscibers get these data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.persistCartItems();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity === 0) {
      this.removeItemFromCart(cartItem);
    }
    else {
      this.calculateTotals();
    }
  }
  
  removeItemFromCart(cartItem: CartItem) {
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);
    if(index > -1) {
      this.cartItems.splice(index, 1);
      this.calculateTotals();
    }
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
