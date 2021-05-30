import { Component, OnInit , OnDestroy} from '@angular/core';
import { ProductsService} from '../../shared/products.service'
import { CartService } from '../../shared/cart.service'
import { Router } from "@angular/router"
import { Cart } from '../../shared/cart'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit , OnDestroy {

  cartItems : Cart[] = [];
  _totalPrice : number = 0;

  constructor( private cartService : CartService, private router : Router) { }

  ngOnInit(): void {
  console.log('cart init');
  this.cartItems = this.cartService.getCartItems();
  console.log("cartItems:", this.cartItems);
  }

  ngOnDestroy(): void {
   // console.log('cart destroy');
  }


  addProduct(id){
    const [selectedProduct] =  this._getCartItem(id);
   
    this.cartService.addToCart(selectedProduct);
  }
 
  subProduct(id){
    const [selectedProduct] =  this._getCartItem(id);
   
    this.cartService.subtractFromCart(selectedProduct);

    //for reactive ui update should i get it from service again???
    this.cartItems = this.cartService.getCartItems()
  }


  _getCartItem(id){
    return [...this.cartItems]
    .filter((product) =>  product.id === id  )
  }

  _countTotalPrice(){
   let totalPrice = 0;
  this.cartItems.reduce<number>((_, cartItem):any=>{
   totalPrice += cartItem.count * cartItem.price
    },0)
    this._totalPrice =  +totalPrice.toFixed(2);
  }

  createOrder(){
    this.router.navigate(['shop/order'], {queryParams: {total: `${this.totalPrice}`}})
  }


  //знаю что в геттере нельзя сайд эфекты (но это решение лежало на поверхности)
  get totalPrice() {
    this._countTotalPrice();
    return this._totalPrice;
  }

}
