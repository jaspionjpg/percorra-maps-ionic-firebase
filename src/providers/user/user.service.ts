import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2/database";
import { FirebaseApp } from "angularfire2";
import * as firebase from 'firebase/app';
import 'firebase/storage';
 
import { User } from './../../models/user.module';
import { BaseService } from "../base.service";

@Injectable()
export class UserService extends BaseService{

  users: FirebaseListObservable<User[]>;
  currentUser: FirebaseObjectObservable<User>;

  constructor(
    public afdb: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public firebaseApp: FirebaseApp,
    public http: Http) {
      super();
      this.users = this.afdb.list(`/users`);
      this.listenAuthState();
  }

  private setUsers(uidToExclude: string): void {
    this.users = <FirebaseListObservable<User[]>>this.afdb.list(`/users`, {
      query: {
        orderByChild: 'username'
      }
    }).map((users: User[]) => {
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
  }

  private listenAuthState(): void {
    this.afAuth
      .authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {        
          this.currentUser = this.afdb.object(`/users/${authUser.uid}`);
          this.setUsers(authUser.uid);
        }
      });
  }

  create(user: User, uuid: string): firebase.Promise<void> {
    return this.afdb.object(`/users/${uuid}`).set(user).catch(this.handlePromiseError);
  }

  edit(user: { name: string, username: string, photo: string}) : firebase.Promise<void>{
    return this.currentUser
      .update(user)
      .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<boolean> {
    return this.afdb.list(`/users`, {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    }).map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }

  get(userId: string) : FirebaseObjectObservable<User>{
    return <FirebaseObjectObservable<User>> this.afdb.object(`/users/${userId}`)
      .catch(this.handleObservableError);
  } 

  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/users/${userId}`)
      .put(file);
  }

}
