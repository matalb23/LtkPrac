import { Component, OnInit } from '@angular/core';
import { DbService } from '../service/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { Servicio } from '../service/servicio';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  
    constructor(private db: DbService,
            private toast: ToastController,
      private router: Router,
      private settings: SettingsService,
      private api: ApiService
    ) { }
    serviciodesdeApi:  Servicio;
    mensajeSinServicio: string;

  ngOnInit() {
  
  }
  ionViewDidEnter() {
   
    this.db.dbState().subscribe((res) => {
   
      if (res) {
        this.cargarDatos();
      }
    });

  }

  
  cargarDatos() {
    this.mensajeSinServicio="";
    let s: Servicio[];//servicio en la bd
    this.db.fetchServicios().subscribe(item => {//s solo para saber si esta en la bd
      s = item;
      this.serviciodesdeApi=item[0];
      if (item.length > 0 && !isNaN(item[0].transfirio)) {
        var transfirio = item[0].transfirio;
        if (transfirio==0) {
          this.EnviarAlaApi(item[0])
        }
      }
    })



    this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {
console.log("entro a la api")
      this.serviciodesdeApi = <Servicio><unknown>data;
      this.serviciodesdeApi.transfirio=1;
      if (data !== null) {//tengo que actualizar         
        if (this.serviciodesdeApi.propietario == this.settings.getValue(SettingsService.setting_User)
          || this.serviciodesdeApi.propietario == null) {//solo si es propietario o no tiene proietario
         
        }
        else {
         
        }
          if (s.length == 0) {

            this.db.addServicio(this.serviciodesdeApi).then(res => { });;
          }
          else {
            this.db.updateServicio(this.serviciodesdeApi).then(res => { });;
          }
  
      }
      else {
        //limpiar bd
        this.db.dropTable().then(
          (data) => { console.log("data", data); },

          (err) => { console.log("err", err); }
        );;

        this.db.fetchFirmas().subscribe(res => {
     
        })
        this.mensajeSinServicio = "No posee servicios asignados.";
      }
    }
      ,
      (err: any) => {

        var respuesta = JSON.parse(JSON.stringify(err));
        console.log("Error al buscar de la api ", respuesta)
     

      }
    );
  }
  EnviarAlaApi(serviciodesdeApi: Servicio) {
    //guardo en la api
    let postData = new FormData();
    this.db.fetchFirmas().subscribe(res => {//sumo las fimas que hay al post
      if (res.length) {

        res.forEach(firma => {
          if (firma.firma != null) {

            const filename = "S" + firma.codigo + "_T" + firma.tipo + ".png"
            const imageBlob = this.dataURItoBlob(firma.blob.substring(22));// con el substring saco data:image/png;base64,                
            const imageFile = new File([imageBlob], filename, { type: 'image/png' });

            postData.append(filename, imageFile);
          }
        })

        serviciodesdeApi.firmas = res;

      }
    })


    postData.append('servicio', JSON.stringify(serviciodesdeApi));


    this.api.post("api/servicio/upload", postData).subscribe((result) => {
      var respuesta = JSON.parse(JSON.stringify(result));
      console.log("api/servicio/upload respuest,", respuesta)

      this.db.servicioTransferido(serviciodesdeApi.codigo).then(res => {
 
      })

    });

  }
  dataURItoBlob(dataURI) {

    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
}
