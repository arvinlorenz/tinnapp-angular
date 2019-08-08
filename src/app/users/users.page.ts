import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: any[];
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.users.subscribe(users => {
      this.users = users;
    });
  }

  ionViewWillEnter() {
    this.userService.users.subscribe(users => {
      this.users = users;
    });
  }
}
