import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Percurso } from '../../models/percurso.module';
import { PercursoService } from '../../providers/percurso/percurso.service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { NavControllerBase } from 'ionic-angular/navigation/nav-controller-base';
import { HomePage } from '../home/home';
import { App } from 'ionic-angular/components/app/app';

@Component({
  selector: 'page-meuspercursos',
  templateUrl: 'meuspercursos.html',
})
export class MeusPercursosPage {

  currentPercursos: Percurso[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menuCtrl: MenuController,
              public app: App,
              public percursoService: PercursoService) {

    percursoService.currentPercursos.subscribe((percusos) => {
      this.currentPercursos = percusos;
    })
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(false, "user-menu")
  }

  ionViewDidLeave(){
    this.menuCtrl.enable(true, "user-menu")
  }

  abrir(percurso){
    let index = this.currentPercursos.indexOf(percurso);
    percurso.aberto = !percurso.aberto;
    if(index > -1){
      this.currentPercursos[index] = percurso;
    }
  }

  ir(percurso){
    
    this.getRootNav().setRoot(HomePage, {percurso: percurso});
  }

  getRootNav(): NavControllerBase {
    let rootNavs = this.app.getActiveNavs();
    if (rootNavs.length === 0) {
        return null;
    } else if (rootNavs.length > 1) {
        console.warn('(getRootNav) there are multiple root navs, use getRootNavs instead');
    }
    return rootNavs[0];
  }
}
