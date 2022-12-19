import { Component, OnInit } from '@angular/core';
import { DbService } from '../service/db.service';
import { ToastController } from '@ionic/angular';
 import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { Servicio } from '../service/servicio';
import { Browser } from '@capacitor/browser';
// import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  latitude: number;
longitude: number;
  constructor(private db: DbService,
    private toast: ToastController,
    private settings: SettingsService,
    private api: ApiService,
    
  ) {
    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
    
      console.log('Current position:', coordinates);
      this.latitude=coordinates.coords.latitude;
      this.longitude=coordinates.coords.longitude;
    };
    printCurrentPosition()

}
  MENSAJESINSERVICIO="No posee servicios asignados."
  serviciodesdeApi: Servicio;
  mensajeSinServicio: string;
  UsuarioNombre;
  PropietarioNombre;
  //public  geo:Position;
  ngOnInit() { 

 //   this.getLocation
   }
  // async NetworkConnected  ()  {
  //   const status = await Network.getStatus();
  //   console.log('Network status:', status);
  //   return status.connected;    
  // }
  ionViewDidEnter() {
    
    //console.log('ccCurrent position:', this.geo);
    var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "practico": "'+ this.settings.getValue(SettingsService.setting_UserPracticoId) + '", "descripcion": "inicio la aplicacion","latitude":"'+this.latitude+'","longitude":"'+this.longitude +'"}';
    console.log("begin api/geolocalizacion",data)
    this.api.post2('api/geolocalizacion',data).subscribe((result) => {
      var respuesta=JSON.parse(JSON.stringify(result)); 
      console.log('api grabo token fcm: ' + respuesta); 
    });
//
    // const logCurrentNetworkStatus = async () => {
    //   const status = await Network.getStatus();
    
    //   console.log('Network status:', status.connected);
    // };
    // logCurrentNetworkStatus();

    if (this.settings.getValue(SettingsService.setting_PracticoConServicio)=="1")
    {
this.mensajeSinServicio="";
    }
    {
      this.mensajeSinServicio=this.MENSAJESINSERVICIO;
          }

    this.db.dbState().subscribe((res) => {

      if (res) {
        this.cargarDatos();
      }
    });
    
     
     this.settings.fetchUserNameGet().subscribe(res=>{
      this.UsuarioNombre=res
    })

  }

  

  async irGuardia() {
    await Browser.open({ 'url': this.settings.getUrlGuardia() });
  }
  async irLink() {
    let parurl = "http://infobae.com/"
    if (parurl.includes("////") || parurl.includes("\\\\")) {

      parurl = parurl.replace("////", "//").replace("\\\\", "\\")
    }
    console.log("url que va a navegar", parurl);
    await Browser.open({ 'url': parurl });
  }
  cargarDatos() {
    let s: Servicio[];//servicio en la bd
    this.db.fetchServicios().subscribe(item => {//s solo para saber si esta en la bd

      this.mensajeSinServicio = "";
      s = item;
      this.serviciodesdeApi = item[0];
      if (item.length > 0 && !isNaN(item[0].transfirio)) {
        var transfirio = item[0].transfirio;
        console.log("Esta transferido?",transfirio)
  
      }
      if (item.length==0)
      {this.mensajeSinServicio=this.MENSAJESINSERVICIO}
      else
      {this.PropietarioNombre=this.serviciodesdeApi.propietarioNombre;}
    })


  }

  cambiarPropietario(){

    
    var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "servicio": "'+ this.serviciodesdeApi.codigo + '"}';
    console.log("cambiarPropietario",data)
        this.api.post2("api/servicio/cambiarPropietario", data).subscribe((result) => {

          var respuesta = JSON.parse(JSON.stringify(result));
          this.db.CambiarPropietario(respuesta.respuesta.login,respuesta.respuesta.name).then(res=>{})
          console.log("respuesta",respuesta.respuesta.login,respuesta.respuesta.name)
        });
     // })
/*  
      this.mostrarEliminarFirmas = false;
      this.db.updateFirmasLimpiar().then(res => {
        this.buscarSinfirmar();
      }).catch(e => {
        console.log("error updateFirmasLimpiar", e);
      });
  */
    
  }
  
}
