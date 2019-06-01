import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

import * as firebase from 'firebase/app';
import { BaseService } from "../base.service";

@Injectable()
export class AuthService extends BaseService {

  constructor(
    public http: Http,
    public auth: AngularFireAuth) {
    super();    
  }

  createAuthUser(user: {email:string, password: string}): firebase.Promise<firebase.User>{
    return this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  signInWithEmail(user: {email:string, password: string}): firebase.Promise<boolean>{
    return this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((authUser: firebase.User) => {
        return authUser != null;
      }).catch(this.handlePromiseError);
  }

  logout(): firebase.Promise<any> {
    return this.auth.auth.signOut();
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth
        .authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
  }
}
