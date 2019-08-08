import { Plugins } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap, switchMap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../users/user.service';

export interface AuthResponseData {
  id: string;
  token: string;
  email: string;
  name: string;
  accountType: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
// tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<any>(null);
  constructor(
    private apollo: Apollo,
    private sharedService: SharedService,
    private userService: UserService
  ) { }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user: any) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  get accountType() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.accountType;
        } else {
          return null;
        }
      })
    );
  }

  getUser(id: string) {
   return this.apollo.watchQuery({
      query: gql`
        query user($id: ID!){
          user(id: $id){
            name
            accountType
          }
        }
      `,
      variables: {
        id
      },
      fetchPolicy: 'network-only'
    })
    .valueChanges
    .pipe(
      map((userRes: any) => {
        return userRes.data.user;
      })
    );
  }
  autoLogin() {
    return from(Plugins.Storage.get({
      key: 'authData'
    })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {token: string; userId: string; accountType: string; };
        const user = {
          id: parsedData.userId,
          token: parsedData.token,
          accountType: parsedData.accountType
        };

        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  login(email: string, password: string) {

    return this.apollo
      .mutate({
        mutation: gql`
          mutation login($data: LoginUserInput!)
          {
            login(data: $data){
              user{
                id
                name
                accountType
              }
              token
            }
          }
        `,
        variables: {
          data: {
            email,
            password
          }
        }
      }).pipe(
        tap((userData: any) => {
          userData = userData.data.login;
          const user = new User(
              userData.user.id,
              userData.user.name,
              userData.user.email,
              userData.token,
              userData.user.accountType);
          this._user.next(user);
          // this.autoLogout(user.tokenDuration);
          this.storeAuthData(
            userData.user.id,
            userData.token,
            userData.user.accountType);
          })
      );
  }


  private storeAuthData(
    userId: string,
    token: string,
    accountType: string
  ) {
    const data = JSON.stringify({userId, token, accountType});
    Plugins.Storage.set({
      key: 'authData',
      value: data
    });
  }


  logout() {
    this._user.next(null);
    this.sharedService._categories.next(null);
    this.sharedService._orders.next([]);
    this.sharedService._products.next([]);
    this.userService._users.next([]);
    Plugins.Storage.remove({key: 'authData'});
  }
}
