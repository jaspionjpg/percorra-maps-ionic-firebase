import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { UserService } from '../providers/user/user.service';
import { AuthService } from '../providers/auth/auth.service';

import * as firebase from 'firebase/app';
import { User } from '../models/user.module';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { NovoPercursoPage } from '../pages/novopercurso/novopercurso';
import { PercursoService } from '../providers/percurso/percurso.service';
import { Percurso } from '../models/percurso.module';
import { MeusPercursosPage } from '../pages/meuspercursos/meuspercursos';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage: any = SigninPage;
  currentUser: User;
  currentPercursos: Percurso[];

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public userService: UserService,
              public authService: AuthService,
              public percursoService: PercursoService,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController) {
    this.initializeApp();

    authService.auth.authState.subscribe((authUser: firebase.User) => {
      if (authUser) {
        userService.currentUser.subscribe((user: User) => {
          this.currentUser = user;
          percursoService.currentPercursos.subscribe((percusos) => {
            this.currentPercursos = percusos;
          })
        })
      }
    });


    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Novo Percurso', component: NovoPercursoPage }
    ];
  }

  openPageNovoPercurso(){
    this.nav.push(NovoPercursoPage);
  }

  openPageMeusPercursos(){
    this.nav.push(MeusPercursosPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onLogout() : void{
    this.alertCtrl.create({
        message: "Você deseja sair?",
        buttons: [{
            text: "Sim",
            handler: () => {
                this.authService.logout()
                    .then(() => {
                        this.nav.setRoot(SigninPage);
                        this.menuCtrl.enable(false, "user-menu")
                    })
            }
        },{
            text: "Não"
        }]
    }).present();
}
}

