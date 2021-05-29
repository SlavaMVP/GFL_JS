import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopNavigationComponent } from './shop-navigation.component';

describe('ShopNavigationComponent', () => {
  let component: ShopNavigationComponent;
  let fixture: ComponentFixture<ShopNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
