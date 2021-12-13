import { Component, OnInit } from '@angular/core';
import { DbService } from '../service/db.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { Servicio } from '../service/servicio';
@Component({
  selector: 'app-servicio',
  templateUrl: 'servicio.page.html',
  styleUrls: ['servicio.page.scss']
})
export class ServicioPage implements OnInit {
  constructor(private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private settings: SettingsService,
    private api: ApiService
  ) { }
  mainForm: FormGroup;
  mostrarEliminarFirmas: Boolean = false;
  EsPropietario: Boolean = false;
  serviciodesdeApi: Servicio
  mensajeSinServicio: string
  ngOnInit() {
    this.inicializarForm();
  }
  inicializarForm() {
    this.mainForm = this.formBuilder.group({
      codigo: [''],
      cliente: [''],
      clienteRazonSocial: [''],
      fechaPedido: [''],
      buqueNombre: [''],
      buqueCoeficiente: [''],
      buqueEslora: [''],
      buqueManga: [''],
      buquePuntal: [''],
      buqueSenial: [''],
      buqueBandera: [''],
      practico1: [''],
      practico1Nombre: [''],
      practico2: [''],
      practico2Nombre: [''],
      lugarDesde: [''],
      lugarHasta: [''],
      lugarKilometros: [''],
      fechaInicio: [''],
      fechaFin: [''],
      calado_Proa: [''],
      calado_Popa: [''],
      cabotaje: [''],
      observacion: [''],
      taraBruta: [''],
      taraNeta: [''],
      canal: [''],
      propietario: this.settings.getValue(SettingsService.setting_User)
    })


    this.buscarSinfirmar().then(res => { });;
  }

  async buscarSinfirmar() {

    this.db.fetchSinFirmar().subscribe(res => {
      this.mostrarEliminarFirmas = res == null;//si hay sin firmar muestro el boton
    })
  }

  setform() {
    this.mensajeSinServicio = "";
    let s: Servicio

    this.db.fetchServicios().subscribe(item => {
      s = <Servicio>item[0];
      if (s != null) {
        let propietario = s.propietario == null ? this.settings.getValue(SettingsService.setting_User) : s.propietario

        if (s.propietario == this.settings.getValue(SettingsService.setting_User)
        || s.propietario == null) {//solo si es propietario o no tiene proietario
        this.EsPropietario = true;
        console.log("Es propietario setform")
        }
        console.log("item.length",item.length)


        this.mainForm.setValue({
          codigo: s.codigo,
          cliente: s.cliente,
          clienteRazonSocial: s.clienteRazonSocial,
          fechaPedido: s.fechaPedido,
          buqueNombre: s.buqueNombre,
          buqueCoeficiente: s.buqueCoeficiente,
          buqueEslora: s.buqueEslora,
          buqueManga: s.buqueManga,
          buquePuntal: s.buquePuntal,
          buqueSenial: s.buqueSenial,
          buqueBandera: s.buqueBandera,
          practico1: s.practico1,
          practico1Nombre: s.practico1Nombre,
          practico2: s.practico2,
          practico2Nombre: s.practico2Nombre,
          lugarDesde: s.lugarDesde,
          lugarHasta: s.lugarHasta,
          lugarKilometros: s.lugarKilometros,
          fechaInicio: s.fechaInicio,
          fechaFin: s.fechaFin,
          calado_Proa: s.calado_Proa,
          calado_Popa: s.calado_Popa,
          cabotaje: s.cabotaje,
          observacion: s.observacion,
          taraBruta: s.taraBruta,
          taraNeta: s.taraNeta,
          canal: s.canal,
          propietario: propietario
        })
      }

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
  storeData() {

    this.serviciodesdeApi = <Servicio><unknown>this.mainForm.value;
    this.serviciodesdeApi.transfirio = 0;//no transfirio
    this.db.updateServicio(this.serviciodesdeApi)
      .then((res) => {
        this.EnviarAlaApi(this.serviciodesdeApi);
      })

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

    // if (!this.mostrarEliminarFirmas) 
    //   this.router.navigate(['/firma']);


  }
  //async
  cargarDatos() {


    let s: Servicio[];//servicio en la bd
    this.db.fetchServicios().subscribe(item => {//s solo para saber si esta en la bd
      s = item;
      if (item.length > 0 && !isNaN(item[0].transfirio)) {
        var transfirio = item[0].transfirio;
        if (transfirio==0) {
          console.log("this.EnviarAlaApi(s[0])", transfirio)
          this.EnviarAlaApi(item[0])
        }
      }
    })



    this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {

      this.serviciodesdeApi = <Servicio><unknown>data;
      this.serviciodesdeApi.transfirio=1;
      if (data !== null) {//tengo que actualizar         
        if (this.serviciodesdeApi.propietario == this.settings.getValue(SettingsService.setting_User)
          || this.serviciodesdeApi.propietario == null) {//solo si es propietario o no tiene proietario
          this.EsPropietario = true;
        }
        else {
          this.EsPropietario = false;
        }
          if (s.length == 0) {

            this.db.addServicio(this.serviciodesdeApi).then(res => { });;
          }
          else {
            this.db.updateServicio(this.serviciodesdeApi).then(res => { });;
          }
   
        this.setform();//carga todo el formulario
        console.log("Es propietario", this.EsPropietario )
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
        console.log("Error ", respuesta)
        if (s.length>0)
        {
          this.setform();//carga todo el formulario
        }

      }
    );
  }
  Firmar()
  {
    this.router.navigate(['/firma']);
  }
  LimpiarFirmas() {
    this.db.fetchFirmas().subscribe(res => {
      this.api.post("api/servicio/firmas/limpiar", res).subscribe((result) => {
        var respuesta = JSON.parse(JSON.stringify(result));

      });
    })

    this.mostrarEliminarFirmas = false;
    this.db.updateFirmasLimpiar().then(res => {
      this.buscarSinfirmar().then(res => { });;
    })

  }
  drop() {

    this.db.dropTable().then((res) => {
    });
  }
  ionViewDidEnter() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.cargarDatos();
      }
    });

  }
}
