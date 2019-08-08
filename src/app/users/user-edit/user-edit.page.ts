import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/auth/user.model';
import { UserService } from '../user.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  user: User;
  userId: string;
  editMode;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private loadCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        this.editMode = true;
        this.userService.getUser(this.userId).subscribe(user => {
          this.user = user;
          this.initializeForm(
            this.user.name,
            this.user.accountType
          );
        });
      } else {
        this.editMode = false;
        this.initializeForm();
      }
    });
  }
  initializeForm(
    name = '',
    accountType = ''
  ) {

    this.form =
      !this.editMode ? this.fb.group({
      name: [name, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      accountType: [accountType, Validators.required]
    })
    : this.fb.group({
      name: [name, Validators.required],
      accountType: [accountType, Validators.required]
    });
  }
 async saveUser() {
    if (!this.form.valid) {
      return;
    }

    const loadEl = await this.loadCtrl.create({ message: 'Saving User'});
    loadEl.present();
    if (!this.editMode) {
      this.userService.createUser(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password,
        this.form.value.accountType
      ).subscribe(() => {
        loadEl.dismiss();
        this.router.navigateByUrl('/users');
      });
    } else {
      this.userService.updateUser(
        this.userId,
        this.form.value.name,
        this.form.value.accountType
      ).subscribe(() => {
        loadEl.dismiss();
        this.router.navigateByUrl('/users');
      });
    }

  }

}
