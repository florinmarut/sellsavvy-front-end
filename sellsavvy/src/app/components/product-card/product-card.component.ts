import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductDTO } from '../../models/dtos/product.model';
import { Router } from '@angular/router';
import { CartItemsService } from '../../services/apis/cart-items.service';
import { CartItemCreateDTO } from '../../models/dtos/cart-item.model';
import { UserDTO } from '../../models/dtos/user.model';
import { ProductsService } from '../../services/apis/products.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, TruncatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductDTO;
  @Input() loggedInUser: UserDTO | undefined;
  @Input() canEdit: boolean = false;

  isAddedToCart: boolean = false;
  imgSrc: string = 'https://picsum.photos/id/1/200/300';

  constructor(
    private readonly _router: Router,
    private readonly _cartService: CartItemsService,
    private readonly _productsService: ProductsService
  ) {}
  ngOnInit(): void {
    let id = Math.floor(Math.random() * (100 - 1 + 1) + 1);
    this.imgSrc = `https://picsum.photos/id/${id}/200/150`;
  }

  viewProduct() {
    this._router.navigate([`view-product/${this.product.id}`]);
  }

  addToCart() {
    const cartItem: CartItemCreateDTO = {
      amount: 1,
      productId: this.product.id,
      userId: this.loggedInUser?.id ?? '',
    };
    this._cartService.createCartItem(cartItem).subscribe({
      next: (value) => {this.isAddedToCart = true;},
      error: (err) => console.error(err),
    });
  }

  editProduct() {
    this._router.navigate([`update-product/${this.product.id}`]);
  }

  deleteProduct() {
    this._productsService.deleteproduct(this.product.id).subscribe({
      next: (value) => {
        this._router.navigate(['success']);
      },
      error: (err) => {
        console.error(err);
        this._router.navigate(['fail']);
      },
    });
  }
}
