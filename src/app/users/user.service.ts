import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UsersPage } from './users.page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // tslint:disable-next-line: variable-name
  public _users = new BehaviorSubject<any>([]);

  constructor(
    private apollo: Apollo
  ) { }

  get users() {
    return this._users.asObservable();
  }

  getUser(id) {
    return this.users.pipe(
      take(1),
      map(users => {
        return users.find(user => user.id === id);
      })
    );
  }

  fetchUsers() {
    // let users;
    return this.apollo
    .watchQuery({
      query: gql`
       query users{
        users{
          id
          name
          email
          accountType
        }
       }
      `,
      fetchPolicy: 'network-only'
    }).valueChanges
    .pipe(
      tap((dataRes: any) => {
        this._users.next(dataRes.data.users);
      })
    );
  }
  createUser(
    name: string,
    email: string,
    password: string,
    accountType: string
  ) {
    let createdUser;
    return this.apollo.mutate({
      mutation: gql`
        mutation createUser($data: CreateUserInput!){
          createUser(data: $data){
            user{
              id
              name
              email
              accountType
            }
          }
        }
      `,
      variables: {
        data: {
          name,
          email,
          password,
          accountType
        }
      }
    }).pipe(
      switchMap((res: any) => {
        createdUser = res.data.createUser;
        return this.users;
      }),
      take(1),
      tap(users => {
        this._users.next(users.concat(createdUser.user));
      })
    );
  }

  updateUser(
    id: string,
    name: string,
    accountType: string
  ) {
    let updatedUser;
    return this.apollo.mutate({
      mutation: gql`
        mutation updateUser($id: ID!, $data: UpdateUserInput!){
          updateUser(id: $id, data: $data){
            id
            name
            email
            accountType
          }
        }
      `,
      variables: {
        id,
        data: {
          name,
          accountType
        }
      }
    }).pipe(
      switchMap(userRes => {
        updatedUser = userRes.data.updateUser;
        return this.users;
      }),
      take(1),
      tap(usersRes => {
        const users = usersRes;
        const userIndex = users.findIndex(user => user.id === id);
        users[userIndex].name = updatedUser.name;
        users[userIndex].accountType = updatedUser.accountType;
        this._users.next(users);
      })
    );
  }
}
