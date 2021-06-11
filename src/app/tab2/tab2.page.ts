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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private settings: SettingsService,
    private api: ApiService
  ) { }
  mainForm: FormGroup;
  servicios: Observable<any[]>;
  Data: any[] = []
  serviciodesdeApi: Servicio
  mensajeSinServicio: string
  ngOnInit() {


    this.mainForm = this.formBuilder.group({
      codigo: [''],
      cliente: [''],
      clienteRazonSocial: [''],
      fechaPedido:  [''],
      buqueNombre: [''],
      buqueCoeficiente: [''],
      buqueEslora:  [''],
      buqueManga:  [''],
      buquePuntal:  [''],
      buqueSenial:  [''],
      buqueBandera:  [''],
      practico1:  [''],
      practico1Nombre:  [''],
      practico2:  [''],
      practico2Nombre:  [''],
      lugarDesde:  [''],
      lugarHasta:  [''],
      lugarKilometros:  [''],
      fechaInicio:  [''],
      fechaFin:  [''],
      calado_Proa:  [''],
      calado_Popa:  [''],
      cabotaje:  ['']
    })

    this.db.dbState().subscribe((res) => {

      if (res) {
       // this.db.deleteServicios();//PRUEBA
        this.db.fetchServicios().subscribe(item => {
          this.Data = item
          console.log("this.Data.length"+this.Data.length.toString()) 
          if (this.Data.length === 0) {

            this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {
              this.serviciodesdeApi = <Servicio><unknown>data;
              if (data !== null) {
              //   this.db.existServicio(this.serviciodesdeApi.codigo)
              // ( (res) => {
              //    if (!res)
              //    {
              //     this.db.addServicio(this.serviciodesdeApi);
              //    }
              //   })

                if (!this.db.existServicio(this.serviciodesdeApi.codigo)) {
                  this.db.addServicio(this.serviciodesdeApi);
                }

                this.mensajeSinServicio = "";
                console.log("this.serviciodesdeApi")
                console.log(this.serviciodesdeApi)

                this.setform(this.serviciodesdeApi)
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
          console.log("fetchServicios");
          console.log(this.Data);
          this.setform(this.Data[0])
        })
      }
    });



  }
  setform(s: Servicio) {
    console.log("s")
    console.log(s)
    if (s!=null){
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
      cabotaje: s.cabotaje
    })
  }
  }
  storeData() {
    //this.db.Update(this.mainForm.value);
     this.db.update( this.mainForm.value)
    .then( (res) => {
      console.log(res)
      this.router.navigate(['/home']);
    })
 
  }
}
