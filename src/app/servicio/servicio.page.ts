import { Component, OnInit } from '@angular/core';
import { DbService } from '../service/db.service';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { Servicio } from '../service/servicio';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
    })


    this.buscarSinfirmar();
  }

  async  buscarSinfirmar() {
  
    this.db.fetchSinFirmar().subscribe(res => {
      this.mostrarEliminarFirmas = res == null;
    })
      

 

  }

  setform() {
    this.mensajeSinServicio = "";
    let s: Servicio

    this.db.fetchServicios().subscribe(item => {
      

      s = <Servicio>item[0];
      if (s != null) {
     //   console.log("set form s:", s)


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
        })
      }

    });


  }
  storeData() {

    this.db.updateServicio(this.mainForm.value)
      .then((res) => {
        console.log("res", res)
        if (!this.mostrarEliminarFirmas) {
          this.router.navigate(['/firma']);
        }
      })

  }
  cargarDatos() {

    
    //this.db.deleteServicios();//PRUEBA
    this.db.fetchServicios().subscribe(item => {

      console.log("this.Data.length " + item.length.toString() + " items bd:", item)

      if (item.length == 0) {

        this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {
          console.log("api data", data);
          this.serviciodesdeApi = <Servicio><unknown>data;
          if (data !== null) {

            if (item.length == 0) {

              console.log("INSERT serviciodesdeApi", this.serviciodesdeApi)
              this.db.addServicio(this.serviciodesdeApi);
            }

            console.log("serviciodesdeApi", this.serviciodesdeApi)
            this.setform();
          }
          else {
            this.mensajeSinServicio = "No posee servicios asignados.";
          }
        }
          ,
          (err: any) => {

            var respuesta = JSON.parse(JSON.stringify(err));

          }
        );
      }
      else {

      }
      console.log("Esta en la bd, registro: ", item);


      this.setform();

    })

  }
  LimpiarFirmas() {
    console.log("clean firmas")
    this.mostrarEliminarFirmas=false;
    this.db.updateFirmasLimpiar().then(res => {
      console.log("updateFirmasLimpiar res",res)
      this.buscarSinfirmar();
    })

  }
drop()
{
  this.db.dropTable();//PRUEBA
}
  ionViewDidEnter() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.cargarDatos();
      }
    });

  }
}
