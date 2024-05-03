import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArticleDTO } from '../../models/dtos/article.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import {
  Subscription,
  catchError,
  combineLatest,
  map,
  switchMap,
  throwError,
} from 'rxjs';
import { ArticlesService } from '../../services/apis/articles.service';
import { ReviewCreateDTO, ReviewDTO } from '../../models/dtos/review.model';
import { ReviewsService } from '../../services/apis/reviews.service';
import { PagedData } from '../../models/dtos/paged.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CartItemsService } from '../../services/apis/cart-items.service';
import { CartItemCreateDTO } from '../../models/dtos/cart-item.model';

@Component({
  selector: 'article-page',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.scss',
})
export class ArticlePageComponent implements OnInit, OnDestroy {
  // article = {
  //   id: '12345',
  //   title: 'The Amazing Gadget',
  //   description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae gravida erat. Nullam nec porta orci, in finibus sem. Cras vestibulum, dui non accumsan bibendum, tortor nunc congue enim, quis pulvinar purus felis pretium enim. Mauris egestas nibh lacus, id fermentum est eleifend in. Duis laoreet luctus massa molestie iaculis. Duis faucibus massa dui, vitae consequat massa vestibulum quis. Suspendisse ligula lectus, semper sed congue at, interdum finibus orci. Fusce vitae accumsan lorem, convallis faucibus ligula. Mauris interdum turpis quis ipsum malesuada, non dignissim mauris rutrum. Suspendisse feugiat, sem ut laoreet venenatis, massa orci gravida est, vitae finibus sem enim a elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec varius lorem lectus, in egestas risus sagittis nec. Phasellus mi risus, pharetra nec purus egestas, ultrices porta mi. Sed mauris urna, varius quis condimentum nec, iaculis a sem. Integer non imperdiet nisl, nec posuere purus.

  //   Etiam varius ex et mollis facilisis. Nam placerat risus et libero scelerisque vehicula. Nunc rhoncus metus aliquet mauris pharetra egestas. Nam malesuada aliquam ornare. Sed ut diam a nisi convallis sollicitudin. Suspendisse magna sapien, dictum ac gravida id, porta non libero. Maecenas rhoncus, risus sit amet vehicula malesuada, risus urna porta turpis, quis scelerisque massa lacus sagittis lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce sodales nunc lacus, vel egestas dolor condimentum ut. Pellentesque eleifend purus nec nunc ultricies iaculis. Proin eget faucibus nisi. Sed laoreet sollicitudin purus. Nunc eu sollicitudin dolor.

  //   Sed rhoncus tempor velit, eget finibus sapien pharetra ut. Aliquam vel ex vitae risus facilisis laoreet. Donec nec rutrum eros, a consectetur urna. Phasellus vehicula pharetra lectus. Suspendisse id molestie lorem. Aliquam erat volutpat. Suspendisse posuere, nulla id sollicitudin convallis, dui nisi dignissim risus, ac venenatis sapien sem eget neque. Phasellus odio nisi, porttitor a congue ut, lacinia nec nisi. In faucibus pretium ligula, sodales mollis lorem molestie ac. Etiam eget ligula ac neque rutrum pretium. Pellentesque at tellus lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis vel dui et erat dapibus pulvinar. Aenean lobortis semper nulla et efficitur.

  //   Nam vulputate finibus mi, id convallis nulla venenatis eu. Phasellus congue nibh sed risus pellentesque, non eleifend ligula vulputate. Nulla rhoncus massa nec facilisis consectetur. Mauris vitae aliquam velit. Quisque et fringilla nisl. Vestibulum lacinia, ante ac porta pretium, quam neque eleifend risus, porta interdum libero ante eu lectus. Donec et odio erat. Donec id augue nec arcu molestie finibus. Morbi vel diam iaculis, gravida lacus eget, porttitor urna. Integer id cursus tellus. Maecenas tempor ipsum nec lacus interdum cursus. Mauris efficitur consectetur rhoncus. Donec et erat sit amet turpis pharetra aliquet.

  //   Cras facilisis lorem et tortor rutrum aliquet. Ut non sapien consequat, fringilla quam sed, euismod odio. Nunc maximus lacinia tortor ut aliquet. Fusce ut condimentum nulla, sit amet lacinia lacus. Duis vel ligula a eros cursus efficitur maximus vitae erat. Vestibulum massa orci, viverra non felis sed, interdum ornare leo. Cras finibus felis in sapien sagittis, sodales efficitur nibh accumsan. Suspendisse imperdiet dolor est, nec eleifend nisi egestas porttitor.'`,
  //   stock: 25,
  //   rating: 4.2,
  //   price: 59.99,
  //   sellerId: 'seller-001',
  //   reviews: [
  //     {
  //       // Dummy review 1 (adjust with your ReviewDTO structure)
  //       rating: 5,
  //       comment: 'Absolutely love this gadget!',
  //     },
  //     {
  //       // Dummy review 2
  //       rating: 3,
  //       comment: 'It works but has some minor issues.',
  //     },
  //     {
  //       // Dummy review 1 (adjust with your ReviewDTO structure)
  //       rating: 5,
  //       comment: 'Absolutely love this gadget!',
  //     },
  //     {
  //       // Dummy review 2
  //       rating: 3,
  //       comment: 'It works but has some minor issues.',
  //     },
  //     {
  //       // Dummy review 1 (adjust with your ReviewDTO structure)
  //       rating: 5,
  //       comment: 'Absolutely love this gadget!',
  //     },
  //     {
  //       // Dummy review 2
  //       rating: 3,
  //       comment: 'It works but has some minor issues.',
  //     },
  //     {
  //       // Dummy review 1 (adjust with your ReviewDTO structure)
  //       rating: 5,
  //       comment: 'Absolutely love this gadget!',
  //     },
  //     {
  //       // Dummy review 2
  //       rating: 3,
  //       comment: 'It works but has some minor issues.',
  //     },
  //     {
  //       // Dummy review 1 (adjust with your ReviewDTO structure)
  //       rating: 5,
  //       comment: 'Absolutely love this gadget!',
  //     },
  //     {
  //       // Dummy review 2
  //       rating: 3,
  //       comment: 'It works but has some minor issues.',
  //     },
  //     {
  //       // Dummy review 1 (adjust with your ReviewDTO structure)
  //       rating: 5,
  //       comment: 'Absolutely love this gadget!',
  //     },
  //     {
  //       // Dummy review 2
  //       rating: 3,
  //       comment: 'It works but has some minor issues.',
  //     },
  //   ],
  // };

  article: ArticleDTO | undefined;
  reviews: PagedData<ReviewDTO> | undefined;
  reviewForm!: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _articlesService: ArticlesService,
    private readonly _reviewsService: ReviewsService,
    private readonly _formBuilder: FormBuilder,
    private readonly _authService: AuthenticationService,
    private readonly _cartService: CartItemsService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const fetchData$ = this._route.paramMap.pipe(
      map((params) => params.get('id')),
      switchMap((id) => {
        return combineLatest([
          this._articlesService.getArticle(id as string),
          this._reviewsService.getPagedReviews(
            1,
            15,
            `ArticleId==\"${id}\"`,
            'id',
            'desc'
          ),
        ]);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );

    const fetchDataSubscription = fetchData$.subscribe({
      next: ([article, reviews]) => {
        this.article = article;
        this.reviews = reviews;
      },
      error: (err) => console.error(err),
    });

    this.subscriptions.push(fetchDataSubscription);
  }

  initForm() {
    this.reviewForm = this._formBuilder.group({
      comment: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  onSubmitReview() {
    const value = { ...this.reviewForm.value };

    const postReview$ = this._authService.getProfile().pipe(
      map((user) => {
        const review: ReviewCreateDTO = {
          comment: value.comment,
          rating: value.rating,
          articleId: this.article?.id as string,
          userId: user.id,
        };

        return review;
      }),
      switchMap((review) =>
        combineLatest([
          this._reviewsService.createReview(review),
          this._reviewsService.getPagedReviews(
            1,
            15,
            `ArticleId==\"${review.articleId}\"`,
            'id',
            'desc'
          ),
        ])
      ),
      catchError((error) => throwError(() => error))
    );

    const postSubscription = postReview$.subscribe({
      next: ([postResponse, reviews]) => {
        this.reviews = reviews;
      },
      error: (err) => console.error(err),
    });
    this.subscriptions.push(postSubscription);
  }

  addToCart() {
    const cartItem: CartItemCreateDTO = {
      articleId: this.article?.id,
      userId: ,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}