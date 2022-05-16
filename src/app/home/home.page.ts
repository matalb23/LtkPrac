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
    
     this.UsuarioNombre = this.settings.getValue(SettingsService.setting_UserName);


  //    this.api.get("api/servicio/usuarioNombre?login=" + this.serviciodesdeApi.propietario).subscribe((data) => {
  //      this.PropietarioNombre=data;       
  //    }
  //    ,
  //    (err: any) => {

  //      var respuesta = JSON.parse(JSON.stringify(err));
  //      console.log("Error al buscar de la api ", respuesta)


  //    }
  //  );





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
        // if (transfirio == 0) {
        //   this.EnviarAlaApi(item[0])
        // }
      }
      if (item.length==0)
      {this.mensajeSinServicio=this.MENSAJESINSERVICIO}
      else
      {this.PropietarioNombre=this.serviciodesdeApi.propietarioNombre;}
    })

  //  if (this.NetworkConnected())//si esta conectado a la red
//{
  /*
    this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {
      console.log("Busca servicio y actualiza bd local:",data)
      this.serviciodesdeApi = <Servicio><unknown>data;
      
      if (data !== null) {//tengo que actualizar         
        this.serviciodesdeApi.transfirio = 1;
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
        this.mensajeSinServicio = this.MENSAJESINSERVICIO;
      }
    }
      ,
      (err: any) => {

        var respuesta = JSON.parse(JSON.stringify(err));
        console.log("Error al buscar de la api ", respuesta)


      }
    );*///servicio
  //}
  // else
  // {
  //   console.log("no tiene red")
  // }

  }
//   EnviarAlaApi(serviciodesdeApi: Servicio) {
//     //guardo en la api
//     let postData = new FormData();
//     this.db.fetchFirmas().subscribe(res => {//sumo las fimas que hay al post
//       console.log(" this.db.fetchFirmas()",res);
//       if (res.length) {

//         res.forEach(firma => {
//           if (firma.firma != null) {

//             const filename = "S" + firma.codigo + "_T" + firma.tipo + ".png"
//             const imageBlob = this.dataURItoBlob(firma.blob.substring(22));// con el substring saco data:image/png;base64,                
//             const imageFile = new File([imageBlob], filename, { type: 'image/png' });

//             postData.append(filename, imageFile);
//           }
//         })

//         serviciodesdeApi.firmas = res;

//       }
//     })


//     postData.append('servicio', JSON.stringify(serviciodesdeApi));


//     this.api.post("api/servicio/upload", postData).subscribe((result) => {
//       var respuesta = JSON.parse(JSON.stringify(result));
//       console.log("api/servicio/upload respuest,", respuesta)
// console.log("this.db.servicioTransferido(",serviciodesdeApi.codigo)
//       this.db.servicioTransferido(serviciodesdeApi.codigo).then(res => {

//       })

//     });

//   }
  // dataURItoBlob(dataURI) {

  //   const byteString = window.atob(dataURI);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const int8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     int8Array[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([int8Array], { type: 'image/png' });
  //   return blob;
  // }

  
}
