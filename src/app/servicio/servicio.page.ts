import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService } from '../service/db.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { Servicio } from '../service/servicio';
import { format, parseISO } from 'date-fns';
import { IonDatetime } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { ServicioDemorasPage } from '../servicio-demoras/servicio-demoras.page';
import { ServicioManiobrasPage } from '../servicio-maniobras/servicio-maniobras.page';
import { Demora } from '../service/demora';
import { Maniobra } from '../service/maniobra';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-servicio',
  templateUrl: 'servicio.page.html',
  styleUrls: ['servicio.page.scss']
})
export class ServicioPage implements OnInit {

  demoraDataResponse: any;
  maniobraDataResponse: any;

  // @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  constructor(private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private settings: SettingsService,
    private api: ApiService,
    public modalCtrl: ModalController

  ) { }
  mainForm: FormGroup;
  mostrarEliminarFirmas: Boolean = false;
  EsPropietario: Boolean = false;
  serviciodesdeApi: Servicio
  mensajeSinServicio: string
  fechaFinTemp;
  fechaInicioTemp;
  FechaInicioNavegacionTemp;
  fechaABordoTemp;
  firmomaster: Boolean = false;
  firmopractico1: Boolean = false;
  firmopractico2: Boolean = false;

  ServicioCodigo;
  ngOnInit() {
    console.log("*** ngOnInit");

  }
  async abrirDemora() {
    const modal = await this.modalCtrl.create({
      component: ServicioDemorasPage,
      componentProps: {
        'codigoservicio': this.ServicioCodigo//serviciodesdeApi.codigo
      }
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse !== null) {
        this.demoraDataResponse = modalDataResponse.data;
        console.log('Modal Demora Sent Data : ' + modalDataResponse.data);
      }
    });

    return await modal.present();
  }
  async abrirManiobra() {
    const modal = await this.modalCtrl.create({
      component: ServicioManiobrasPage,
      componentProps: {
        'codigoservicio': this.ServicioCodigo//serviciodesdeApi.codigo
      }
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse !== null) {
        this.maniobraDataResponse = modalDataResponse.data;
        console.log('Modal Maniobra Sent Data : ' + modalDataResponse.data);
      }
    });

    return await modal.present();
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
      propietario: this.settings.getValue(SettingsService.setting_User),
      FechaInicioNavegacion: [''],
      fechaABordo: [''],
    })

    //this.buscarSinfirmar();

  }

  buscarSinfirmar() {


    let firmados = 0;
    let firmas = 0;
    this.firmomaster = false;
    this.firmopractico1 = false;
    this.firmopractico2 = false;
    this.db.fetchFirmas().subscribe(res => {
      res.forEach(firma => {
        firmas++;
        if (firma.tipo == 'Master' && firma.blob != null) {
          this.firmomaster = true;
          console.log("FIRMO MASTER")
        }
        if (firma.tipo == 'Practico1' && firma.blob != null) {
          this.firmopractico1 = true;
          console.log("FIRMO Practico1")
        }
        if (firma.tipo == 'Practico2' && firma.blob != null) {
          this.firmopractico2 = true;
          console.log("FIRMO Practico2")
        }

        if (firma.firma != null && firma.blob != null) {
          firmados++;
        }
      });

      // if (firmados == firmas) {
      this.mostrarEliminarFirmas = firmados == firmas;//si hay sin firmar muestro el boton
      // }
    }
    )
    return false;
  }
  setform() {
    this.mensajeSinServicio = "";
    let s: Servicio

    this.db.fetchServicios().subscribe(item => {
      s = <Servicio>item[0];

      if (s != null) {
        let propietario = s.propietario == null ? this.settings.getValue(SettingsService.setting_User) : s.propietario

        console.log("Propietario", propietario, "usario", this.settings.getValue(SettingsService.setting_User))
        this.cargarPropietario(s.propietario);


        this.fechaFinTemp = s.fechaFin;
        this.fechaABordoTemp = s.fechaABordo;
        this.FechaInicioNavegacionTemp = s.fechaInicioNavegacion;

        this.fechaInicioTemp = s.fechaInicio;
        this.ServicioCodigo = s.codigo;
        console.log("s.fechaFin;", s.fechaFin)
        console.log("s.fechaInicio;", s.fechaInicio)

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
          propietario: propietario,
          FechaInicioNavegacion: s.fechaInicioNavegacion,
          fechaABordo: s.fechaABordo,

        })
        // this.cargarPropietario(s.propietario);
        this.buscarSinfirmar();
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
    console.log("fechaFinTemp", this.fechaFinTemp);
    console.log("fechaInicioTemp", this.fechaInicioTemp);



    if (this.fechaFinTemp != null)
      this.serviciodesdeApi.fechaFin = this.fechaFinTemp.replace("T", " ");
    if (this.fechaInicioTemp != null)
      this.serviciodesdeApi.fechaInicio = this.fechaInicioTemp.replace("T", " ");
    if (this.fechaABordoTemp != null)
      this.serviciodesdeApi.fechaABordo = this.fechaABordoTemp.replace("T", " ");
    if (this.FechaInicioNavegacionTemp != null)
      this.serviciodesdeApi.fechaInicioNavegacion = this.FechaInicioNavegacionTemp.replace("T", " ");


    this.db.updateServicio(this.serviciodesdeApi)
      .then((res) => {
        //let sincronizo:boolean=false;

        this.EnviarAlaApi(this.serviciodesdeApi)//.then((sincronizo) => {

        //   if (sincronizo)
        //   this.settings.Toast_presentSuccess("Guardo y Sincronizó con exito");
        // else
        //   this.settings.Toast_presentWarnig("Guardo con éxito");

        //  });


      })
      .catch(e => {
        console.log("error this.db.updateServicio", e);
      });



  }
  EnviarAlaApi(serviciodesdeApi: Servicio) {
    //guardo en la api
    let postData = new FormData();
    let demorasnuevas: Demora[] = [];
    let maniobrasnuevas: Maniobra[] = [];
    //let sincronizo:boolean=false;

    this.db.fetchFirmas().subscribe(res => {//sumo las fimas que hay al post
      if (res.length) {

        res.forEach(firma => {
          if (firma.firma != null && firma.blob != null) {

            const filename = "S" + firma.codigo + "_T" + firma.tipo + ".png"
            const imageBlob = this.dataURItoBlob(firma.blob)
            console.log(firma.tipo, "blob", firma.blob, firma.blob.text)
            const imageFile = new File([imageBlob], filename, { type: 'image/png' });
            postData.append(filename, imageFile);
          }
        })

        serviciodesdeApi.firmas = res;
        console.log("Firmas", res)
      }
    })

    //envia los no transferidos
    this.db.fetchDemoras().subscribe(res => {

      if (res.length) {
        res.forEach(demora => {
          if (demora.id == this.db.TransferidoNOValor) {
            demorasnuevas.push(demora);
          }
        })
      }
      serviciodesdeApi.demorasnuevas = demorasnuevas
    })
    //envia los no transferidos
    this.db.fetchManiobras().subscribe(res => {

      if (res.length) {
        res.forEach(maniobra => {
          if (maniobra.id == this.db.TransferidoNOValor) {
            maniobrasnuevas.push(maniobra);
          }
        })
      }
      serviciodesdeApi.maniobrasnuevas = maniobrasnuevas
    })

    postData.append('servicio', JSON.stringify(serviciodesdeApi));
    console.log("postData:", postData)
    console.log("json a la api:", JSON.stringify(serviciodesdeApi))
    this.api.post("api/servicio/upload", postData).subscribe((result) => {
      serviciodesdeApi.transfirio = 1;
      this.db.servicioTransferido(serviciodesdeApi).then(() => {
      })
        .catch(e => {
          console.log("error this.db.servicioTransferido", e);
        });

      demorasnuevas.forEach(demora => {
        this.db.demoraTransferido(demora.idInterno)
      })
      maniobrasnuevas.forEach(maniobra => {
        this.db.maniobraTransferido(maniobra.idInterno)
      })
      console.log(" sincronizo true");
      //return true;
      let s: Servicio[];//servicio en la bd

      this.db.fetchServicios().subscribe(item => {//s solo para saber si esta en la bd
        s = item;
      })
      this.getApi(s);
    });

    //  return false;
    //   return test;

  }

  cargarDatos() {
    let s: Servicio[];//servicio en la bd//
    let transfirio: boolean = true;
    let NuevoServicio: boolean = false;
    this.db.fetchServicios().subscribe(item => {//s solo para saber si esta en la bd
      s = item;
      if (item.length > 0) {
        if (!isNaN(item[0].transfirio)) {
          this.serviciodesdeApi = <Servicio><unknown>s[0];
          this.setform();
          if (item[0].transfirio == 0) {
            transfirio = false;
          }
        }

      }
    })
    if (!transfirio) {
      console.log("this.EnviarAlaApi(s[0]),, va a transferir", transfirio)

      this.settings.setValue(SettingsService.setting_Interceptor_ShowToast, '0');
      this.EnviarAlaApi(s[0])//hace getpi
      this.settings.setValue(SettingsService.setting_Interceptor_ShowToast, '1');
      console.log("transfirio y hace get", transfirio)

      //})

    }
    else
      this.getApi(s);


  }
  getApi(s: Servicio[]) {
    let NuevoServicio: boolean = false;
    this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {
      console.log("Busca servicio y actualiza bd local:", data)
      this.serviciodesdeApi = <Servicio><unknown>data;

      if (data !== null) {//tengo que actualizar         
        this.serviciodesdeApi.transfirio = 1;
        this.cargarPropietario(this.serviciodesdeApi.propietario);
        if (s.length == 0)
          NuevoServicio = true
        else
          if (s[0].codigo != this.serviciodesdeApi.codigo)
            NuevoServicio = true
          else
            NuevoServicio = false

        if (NuevoServicio) {
          console.log("agrega", s)
          this.db.deleteServicio().then(res => {
            this.db.addServicio(this.serviciodesdeApi).then(res => { })
              .catch(e => {
                console.log("error this.db.addServicio", e);
              });
          });;

        }
        else {
          console.log("modifica", s)
          this.db.updateServicio(this.serviciodesdeApi).then(res => { }).catch(e => {
            console.log("error this.db.updateServicio", e);
          });

        }

        this.setform();//carga todo el formulario
        console.log("Es propietario", this.EsPropietario)
      }
      else {

        this.db.deleteServicio().then(res => {
          console.log("res", res)

        })
          .catch(e => {
            console.log("error llamar delete", e);
          });
        this.mensajeSinServicio = "No posee servicios asignados.";
      }
    }
      ,
      (err: any) => {

        var respuesta = JSON.parse(JSON.stringify(err));
        console.log("Error ", respuesta)
        if (s.length > 0) {
          this.setform();//carga todo el formulario
        }

      }
    );

  }
  Firmar(tipo) {

    this.router.navigate(['/firma', { firmanteTipo: tipo }]);
  }
  LimpiarFirmas() {
    this.db.fetchFirmas().subscribe(res => {
      this.api.post("api/servicio/firmas/limpiar", res).subscribe((result) => {
        var respuesta = JSON.parse(JSON.stringify(result));

      });
    })

    this.mostrarEliminarFirmas = false;
    this.db.updateFirmasLimpiar().then(res => {
      this.buscarSinfirmar();
    }).catch(e => {
      console.log("error updateFirmasLimpiar", e);
    });

  }
  cargarPropietario(PropietarioDelServicio) {

    if (PropietarioDelServicio != null) {
      if (PropietarioDelServicio.toUpperCase() == this.settings.getValue(SettingsService.setting_User).toUpperCase()
        || PropietarioDelServicio == null) {//solo si es propietario o no tiene proietario
        this.EsPropietario = true;
      }
      else {
        this.EsPropietario = false;
      }
    }
    else { this.EsPropietario = true; }
  }

  ionViewDidEnter() {
    this.inicializarForm();
    console.log("*** ionViewDidEnter");
    this.fechaFinTemp = null;
    this.fechaInicioTemp = null;
    this.fechaABordoTemp = null;
    this.FechaInicioNavegacionTemp = null;
    this.ServicioCodigo = null;

    this.db.dbState().subscribe((res) => {
      if (res) {
        this.cargarDatos();
      }
    });

  }
  ionViewWillEnter() { console.log("*** ionViewWillEnter"); }
}
