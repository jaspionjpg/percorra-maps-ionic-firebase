import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import * as firebase from 'firebase/app';
import 'firebase/storage';
 
import { BaseService } from "../base.service";
import { Percurso } from '../../models/percurso.module';

@Injectable()
export class PercursoService extends BaseService {

    currentPercursos: FirebaseListObservable<Percurso[]>;
    
    constructor(
        public afdb: AngularFireDatabase,
        public afAuth: AngularFireAuth,
        public http: Http) {
        super();
        this.listenAuthPercursos();
    }

    getPercursos(userId1: string) : FirebaseListObservable<Percurso[]> {
        return  <FirebaseListObservable<Percurso[]>> this.afdb.list(`/percursos/${userId1}`).catch(this.handleObservableError);
    }

    private listenAuthPercursos(): void {
        this.afAuth
          .authState
          .subscribe((authUser: firebase.User) => {
            if (authUser) {        
              this.currentPercursos = this.afdb.list(`/percursos/${authUser.uid}`);
            }
        });
      }

    create(percurso: Percurso): firebase.Promise<Percurso>{
        return this.currentPercursos.push(percurso)
        .catch(this.handlePromiseError);
      }
}