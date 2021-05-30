import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/cart.service'
import { Router } from "@angular/router"
import { Cart } from '../../shared/cart'
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  cartItems : Cart[] = [];
  orderPrice : number = 0;
  orderForm : FormGroup;

  constructor(private cartService : CartService, private router : Router) {
    this.orderForm = new FormGroup({
      username: new FormControl('', [Validators?.required, Validators?.maxLength(30)] ), 
      surname: new FormControl('', [Validators?.maxLength(30)]),
      email: new FormControl('',[Validators?.required, Validators?.email]), //, Validators?.minLength[6], 
      phone: new FormControl('',[Validators?.required,  Validators?.pattern(/^[0-9]\d*$/)]),
    })
   }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    //type of guard
    if(this.cartItems.length === 0){
      this.router.navigate([`shop/`])
    }

    this.orderPrice = this.router.parseUrl(this.router.url).queryParams.total; 
  }

  makeOrder(e){
    e.preventDefault();
    console.log('ordered')
    console.log(this.orderForm.controls.username.value)
    //cart items goes to orders in DB
    this.cartService.clearCart();
    this.router.navigate([`shop/thnx`], {queryParams: {clientName: `${this.orderForm.controls.username.value}`}} ) //{queryParams:}
  }


}
