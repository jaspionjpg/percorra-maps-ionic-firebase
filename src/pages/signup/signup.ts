import { Component } from '@angular/core';
import { AlertController, Loading,  LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth.service';
import { HomePage } from '../home/home';

import * as firebase from 'firebase/app';
import { UserService } from '../../providers/user/user.service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;

  constructor(
    public authService : AuthService,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() : void {
    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username: string = formUser.username;
    
    this.userService.userExists(username)
    .first()
    .subscribe((userExists: boolean) => {
      if(!userExists){
              
        this.authService.createAuthUser({
          email: formUser.email,
          password: formUser.password
        }).then((authUser: firebase.User) => {

          delete formUser.password;

          this.userService.create(formUser, authUser.uid).then(() => {
            console.log('Usuario cadastrado!');
            loading.dismiss();
            this.menuCtrl.enable(true, "user-menu")
            this.navCtrl.setRoot(HomePage);
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
        });

        }).catch((error: any) => {
          console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });

       } else {
        this.showAlert(`O username ${username} já está sendo usado em outra conta!`);
        loading.dismiss();
      }
  });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Please wait.."
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ["OK"]
    }).present();
  }

}
