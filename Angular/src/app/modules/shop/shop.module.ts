import { NgModule } from '@angular/core';
import {HttpClientModule}  from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router'

import { CommonModule } from '@angular/common';
import { ShopComponent } from './components/shop/shop.component';
import { CartComponent } from './components/cart/cart.component';
import { ThankYouPageComponent } from './components/thank-you-page/thank-you-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { ShopNavigationComponent } from './components/shop-navigation/shop-navigation.component';
import { ProductListComponent } from './components/product-list/product-list.component';

const routes: Routes = [
{path: "shop", children: [
  {path: '', component: ProductListComponent},
  {path: 'cart', component: CartComponent},
  {path: 'thnx', component: ThankYouPageComponent},
 // {path: "**", component: NotFoundPageComponent}
]},

]

@NgModule({
  declarations: [
    ShopComponent,
    CartComponent,
    ThankYouPageComponent,
    NotFoundPageComponent,
    ShopNavigationComponent,
    ProductListComponent
  ], exports: [
    ShopComponent,
    NotFoundPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ]
})
export class ShopModule { }
