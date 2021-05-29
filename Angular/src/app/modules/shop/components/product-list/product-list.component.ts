import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { ProductsService} from '../../shared/products.service'
import { CartService } from '../../shared/cart.service'
import { Product } from '../../shared/products'
import { Cart } from '../../shared/cart'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  cartItems: Cart[] = [];

  constructor(private productsService : ProductsService , private cartService : CartService, private router : Router) { }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(products => {
       this.products = <Product[]>products;
    });
    this.cartItems = this.cartService.getCartItems();
  }

  addToCart(id){
   const [selectedProduct] = this._findProduct(id);
   const newCartItem  = this._createCartItem(selectedProduct);

    this.cartService.addToCart(newCartItem);
   
 
    this.router.navigate(['shop/cart'])
  }

  _findProduct(id){
   return [...this.products]
   .filter((product) =>  product.id === id  )
  }

  isProductAvailable(id){
    if(this.cartItems.length){
      const [cartItem]  = this._findCartItem(id);

      if(cartItem && cartItem?.count === cartItem?.available){
        return true
      } 
        return false
      
    }
   
  }

  _findCartItem(id){
    return [...this.cartItems]
    .filter((product) =>  product.id === id  )
   }

  _createCartItem(product) {
    return {
      id:product.id,
      name: product.name,
      price: product.price,
      available: product.available,
      count: 1
    }
  }
    
  
}
