import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Price } from '../price.model';
import { ProductsService } from '../products.service';
import { LoadingController } from '@ionic/angular';
import { Category } from '../category.model';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {

  now: string;
  to: string;
  product: Product;
  productId: string;
  editMode = false;
  form: FormGroup;
  oldPrice: Price;
  categories: Category[];
  imagePreview: string  | ArrayBuffer;

  constructor(
    private productService: ProductsService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.now = (new Date()).toISOString();
    this.to = new Date(new Date().getTime() + 63113852000).toISOString();
    this.sharedService.categories.subscribe(categoriesRes => {
      this.categories = categoriesRes;
    });
    this.route.paramMap.subscribe(paraMap => {
      if (paraMap.has('productId')) {
        this.editMode = true;
        this.productId = paraMap.get('productId');
        this.productService.getProduct(this.productId).subscribe(product => {
          this.product = product;
          this.oldPrice = {
            provincialDistributor: product.price.provincialDistributor,
            cityDistributor: product.price.cityDistributor,
            reseller: product.price.reseller,
            retail: product.price.retail
          };
          this.imagePreview = this.product.image;
          this.initializeForm(
            product.name,
            product.code,
            product.available,
            product.expDate,
            product.category.id,
            product.price.provincialDistributor,
            product.price.cityDistributor,
            product.price.reseller,
            product.price.retail,
            product.image);
        }, () => this.router.navigateByUrl('/products')
        );
      } else {
        this.editMode = false;
        this.initializeForm();
      }
    });
  }

  private initializeForm(
    name = '',
    code = '',
    available = '',
    expDate = '',
    category = '',
    provincialDistributor = '',
    cityDistributor = '',
    reseller = '',
    retail = '',
    image = '') {
   this.form = this.fb.group({
      name: [name, Validators.required],
      code: [code, Validators.required],
      available: [available, [Validators.required, Validators.min(0)]],
      expDate: [expDate, Validators.required],
      category: [category, Validators.required],
      image: [image, Validators.required],
      prices: this.fb.group({
        provincialDistributor: [provincialDistributor, Validators.required],
        cityDistributor: [cityDistributor, Validators.required ],
        reseller: [reseller, Validators.required ],
        retail: [retail, Validators.required ],
      }),
    });
   console.log(this.form.value);

  }

  async onSaveProduct() {
    if (!this.form.valid) {
      return;
    }
    const loadingEl = await this.loadingCtrl.create({message: 'Saving Product'});
    loadingEl.present();


    if (this.editMode) {
      this.productService.editProduct(
        this.productId,
        this.form.value.name,
        this.form.value.code,
        this.form.value.available,
        this.form.value.expDate,
        this.form.value.category,
        this.form.value.prices,
        this.oldPrice
      ).subscribe(() => {
        this.loadingCtrl.dismiss();
        this.router.navigateByUrl('/products');
      });
    } else {
      this.productService.createProduct(
        this.form.value.name,
        this.form.value.code,
        this.form.value.available,
        this.form.value.expDate,
        this.form.value.category,
        this.form.value.prices,
        this.form.value.image
      ).subscribe(() => {
        this.loadingCtrl.dismiss();
        this.router.navigateByUrl('/products');
      });
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
