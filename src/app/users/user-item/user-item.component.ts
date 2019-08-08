import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit {
  @Input() user;
  accountTypes = {
    RETAILER: 'Retail',
    RESELLER:   'Reseller',
    CITY_DISTRIBUTOR: 'City Distributor',
    PROVINCIAL_DISTRIBUTOR: 'Provincial Distributor',
  };
  constructor() { }

  ngOnInit() {}

}
