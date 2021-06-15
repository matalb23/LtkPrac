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
  //servicios: Observable<any[]>;
 // Data: any[] = []
  serviciodesdeApi: Servicio
  mensajeSinServicio: string
  ngOnInit() {
  this.inicializarForm();
   // this.db.dropTable()

    // this.db.dbState().subscribe((res) => {
      
    // });



  }
  inicializarForm()
  {
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
      cabotaje:  [''],
      observacion:  [''],
      taraBruta:  [''],
      taraNeta:  [''],
      canal:  [''],
    })
  }
setform() {
  this.mensajeSinServicio = "";
  let  s: Servicio
  
  this.db.fetchServicios().subscribe(item => {
 ;
   
   s=<Servicio>item[0];
    if (s!=null){
     console.log("set form s:",s)
   
   
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
     observacion:  s.observacion,
     taraBruta:  s.taraBruta,
     taraNeta:  s.taraNeta,
     canal:  s.canal,
   })
  }

});


 }
  storeData() {
    //this.db.Update(this.mainForm.value);
     this.db.update( this.mainForm.value)
    .then( (res) => {
      console.log("res",res)
      // this.router.navigate(['/home']);
    })
 
  }
  cargarDatos(){
    // if (res) {
       //this.db.dropTable();//PRUEBA
      // this.db.deleteServicios();//PRUEBA
       this.db.fetchServicios().subscribe(item => {
        // this.Data = item
         console.log("this.Data.length "+item.length.toString()+" items bd:",item) 
         
         if (item.length == 0) {

           this.api.get("api/servicio?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe((data) => {
             console.log("api data",data);
             this.serviciodesdeApi = <Servicio><unknown>data;
             if (data !== null) {
         
               //if (!this.db.existServicio(this.serviciodesdeApi.codigo)) {

                 //if(this.serviciodesdeApi.codigo!= this.db.serviciosList[0].codigo){
                   if (item.length==0 ){
                // this.db.deleteServicios();
                 console.log("INSERT serviciodesdeApi",this.serviciodesdeApi)
                 this.db.addServicio(this.serviciodesdeApi);
               }

              
           

               //this.setform(this.serviciodesdeApi)
               console.log("serviciodesdeApi",this.serviciodesdeApi)
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
         console.log("Esta en la bd, registro: ",item );
         
         
         this.setform();

       })
    //  }

  }

  ionViewDidEnter(){
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.cargarDatos();
      }  
    });
    
  }
}
