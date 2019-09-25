import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderService } from '../order.service';
import { Screenshot } from '@ionic-native/screenshot/ngx';

@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.page.html',
  styleUrls: ['./order-receipt.page.scss'],
})

export class OrderReceiptPage implements OnInit {
  accountTypes = {
    RETAILER: 'retail',
    RESELLER:   'reseller',
    CITY_DISTRIBUTOR: 'cityDistributor',
    PROVINCIAL_DISTRIBUTOR: 'provincialDistributor',
  };

  orderId;
  order;
  orderedProducts;
  accountType;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private screenshot: Screenshot) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('orderId')) {
          this.orderId = paramMap.get('orderId');
          this.orderService.getOrder(this.orderId).subscribe(order => {
            this.order = order;
            this.accountType = this.accountTypes[this.order.buyer.accountType];
            console.log(this.accountType);
            this.orderedProducts = this.order.products;
          });
        }
      });
  }
  screenShot() {
    // this.screenshot.save('jpg', 80, 'myscreenshot.jpg').then(res => {
    //   console.log(res);
    // });
  }

}
