import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { reorderArray } from 'ionic-angular/util/util';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { PercursoService } from '../../providers/percurso/percurso.service';
import { Percurso } from '../../models/percurso.module';
import { Ponto } from '../../models/ponto.module';
import { HomePage } from '../home/home';
import { App } from 'ionic-angular/components/app/app';
import { NavControllerBase } from 'ionic-angular/navigation/nav-controller-base';

@Component({
  selector: 'page-novopercurso',
  templateUrl: 'novopercurso.html',
})
export class NovoPercursoPage {

  pontos:Ponto[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public app: App,
              public alertCtrl: AlertController, 
              public menuCtrl: MenuController,
              public percursoService: PercursoService) {
              this.pontos = [];
  }

  ir() {
  }


  salvar(){
    let prompt = this.alertCtrl.create({
      title: 'Como quer chamar esse caminho?',
      inputs: [{
          name: 'title'
      }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Adicionar',
          handler: data => {
            let percurso: Percurso = new Percurso(this.pontos, data.title);
        
            this.percursoService.create(percurso);
        
           // this.navCtrl.pop();
            this.getRootNav().setRoot(HomePage, {percurso: percurso});
            this.menuCtrl.open("user-menu");
          }
        }
      ]
    });

    prompt.present();
  }
  
  ionViewDidLoad() {
    this.menuCtrl.enable(false, "user-menu")
  }

  ionViewDidLeave(){
    this.menuCtrl.enable(true, "user-menu")
  }

  reorderItems(indexes){
    this.pontos = reorderArray(this.pontos, indexes);
  }

  addNote(){
    let prompt = this.alertCtrl.create({
      title: 'Add Note',
      inputs: [{
          name: 'title'
      }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            this.pontos.push(new Ponto(data.title));
          }
        }
      ]
    });

    prompt.present();
  }

  editNote(note){
    let prompt = this.alertCtrl.create({
      title: 'Edit Note',
      inputs: [{
        name: 'title'
      }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            let index = this.pontos.indexOf(note);

            if(index > -1){
              this.pontos[index] = new Ponto(data.title);
            }
          }
        }
      ]
    });

    prompt.present();      
  }
    
  deleteNote(note){
    let index = this.pontos.indexOf(note);

    if(index > -1){
        this.pontos.splice(index, 1);
    }
  }
    
  duplicateNote(note){
    let index = this.pontos.indexOf(note);
    if(index > -1){
        this.pontos.push(this.pontos[index]);
    }
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
