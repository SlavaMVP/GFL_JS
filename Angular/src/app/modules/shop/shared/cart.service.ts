import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart } from './cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: Cart[] = [];
  index = -1;

  constructor(private http: HttpClient) {}

  addToCart(product: Cart) {
    const isInCart = this._isInCart(product);

    if (isInCart) {
      let cartItem = { ...this.cart[this.index] };
      //const available = this._productsAvailable(cartItem);
      //console.log(available);
if(cartItem.count !== cartItem.available){
  this.cart[this.index] = { ...cartItem, count: cartItem.count + 1 };
}
   
    } else {
      this.cart.push(product);
    }
  }

  subtractFromCart(product: Cart) {
    const isInCart = this._isInCart(product);

    if (isInCart) {
      let cartItem = { ...this.cart[this.index] };

      if (cartItem.count !== 1) {
        this.cart[this.index] = { ...cartItem, count: cartItem.count - 1 };
      } else {
       this.deleteCartItem();
      }
    }
  }

  clearCart() {
    this.cart = [];
  }

  deleteCartItem(){
   const newCart =[...this.cart].filter((_, idx)=>{
      return idx !== this.index ;
    })

    this.cart = newCart;
  }

  getCartItems() {
    return this.cart
  }

  
/*
  _productsAvailable(cartItem){
     const product =  this._findProduct(cartItem.id);
     
     return product["available"]
  }

 _findProduct(id){
    console.log(this.cart)
    return [...this.products]
    .filter((product) =>  product.id === id  )
   }*/

  _isInCart(product){
   return this.cart.find((cartItem, i) => {
      this.index = i;
      return cartItem.id === product.id;
    });
  }
}
