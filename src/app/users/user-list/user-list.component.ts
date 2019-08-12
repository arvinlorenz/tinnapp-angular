import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @Input() users;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private userService: UserService
  ) { }

  ngOnInit() {}

  onEdit(userId, slidingItem) {
    slidingItem.close();
    this.router.navigate(['/', 'users', userId]);
  }
  async onDelete(userId, slidingItem) {
    slidingItem.close();
    const loadingEl = await this.loadingCtrl.create({message: 'Deleting User...'});
    loadingEl.present();

    this.userService.deleteUser(userId).subscribe(() => {
      loadingEl.dismiss();
    })
  }
}
