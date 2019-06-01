import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { Loading } from 'ionic-angular/components/loading/loading';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth/auth.service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signinForm: FormGroup;

  constructor(
              public authService : AuthService,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public menuCtrl: MenuController) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    let loading: Loading = this.showLoading();

    this.authService.signInWithEmail(this.signinForm.value)
      .then((isLogged: boolean) => {
        if(isLogged){
          this.navCtrl.setRoot(HomePage);
          this.menuCtrl.enable(true, "user-menu")
          loading.dismiss();
        }

    }).catch((error: any) => {
        console.log(error);
        loading.dismiss();
        this.showAlert(error);
    });
  }

  onSignup(): void{
    this.navCtrl.push(SignupPage);
  }


  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Espere por favor.."
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
