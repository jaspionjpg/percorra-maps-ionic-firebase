import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Geolocation } from '@ionic-native/geolocation';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Percurso } from '../../models/percurso.module';
import { filter } from 'rxjs/operators/filter';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  percurso: Percurso;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  start = '';
  end = '';
  
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  startPosition: any;
  locations: any[];
  marker: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private geolocation: Geolocation) {
    this.percurso = navParams.get("percurso");
  }

  ionViewDidLoad(){
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions = {
      zoom: 18,
      disableDefaultUI: true
    }
 
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    if(this.percurso != null){
      this.calculateRoutePeloPercurso();
    } else {
      this.centerUser();
    }
  }


  centerUser(){    
    this.geolocation.getCurrentPosition()
    .then((resp) => { 
      let position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map.setZoom(18);
      this.map.setCenter(position);

      this.marker = new google.maps.Marker({
        position: position,
        map: this.map,
      });

      this.directionsDisplay.setMap(null);

    }).catch((error) => {
      this.startPosition = new google.maps.LatLng(-21.763409, -43.349034);
    });
  }

  // Usado para traçar rota
  calculateRoute() {
    if (this.end && this.start) {
      this.directionsDisplay.setMap(this.map);

      const request = {
        // Pode ser uma coordenada (LatLng), uma string ou um lugar
        origin: this.start,
        destination: this.end,
        travelMode: 'DRIVING'
      };
      this.marker.setVisible(false);
      this.traceRoutes(this.directionsService, this.directionsDisplay, request);
    }
  }
  
  calculateRoutePeloPercurso() {
    this.directionsDisplay.setMap(this.map);

    this.start = this.percurso.pontos[0].local;
    this.end = this.percurso.pontos[this.percurso.pontos.length-1].local;

    this.locations = this.percurso.pontos.filter((ponto, index) => (index != 0 && index != this.percurso.pontos.length-1)).map(ponto => { return {location: ponto.local}});

    const request = {
      origin: this.start,
      destination: this.end,
      waypoints: this.locations,
      travelMode: 'DRIVING'
    };
    this.traceRoutes(this.directionsService, this.directionsDisplay, request);
  }

  traceRoutes(service: any, display: any, request: any) {
    service.route(request, function (result, status) {
      if (status == 'OK') {
          display.setDirections(result);
      }
    });
  }

  isTracking: boolean = false;
  
  startPercurso(){
    this.isTracking = true;
    var markerAtual = new google.maps.Marker({
      map: this.map,
    })

    let circle = new google.maps.Circle({
      radius: 5,
      fillColor: "rgba(0, 0, 255, 0.5)",
      strokeColor: "rgba(0, 0, 255, 0.75)",
      map: this.map,
      strokeWidth: 1
    })
    
    markerAtual.bindTo("position", circle, "center");
    
    this.geolocation.watchPosition().pipe(filter(p => p.coords != undefined)).subscribe(data => {
      this.map.setZoom(19);
      this.map.setCenter({lat: data.coords.latitude, lng: data.coords.longitude});
      
      markerAtual.setPosition({lat: data.coords.latitude, lng: data.coords.longitude});
      circle.setCenter({lat: data.coords.latitude, lng: data.coords.longitude});
    })

  }





  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}

