import { Component, OnInit,ViewChild  } from '@angular/core';
import { ApiService } from '../service/api.service';
import { SettingsService } from '../service/settings.service';
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
  servicios;
  mainForm: FormGroup;
  fechainicio;
 // fechaInicioTemp;
  fechafin;
 // fechaABordoTemp;
  constructor(
    public formBuilder: FormBuilder,
        private api: ApiService,
        private settings: SettingsService,
  ) { }

  
  ngOnInit() {
   this.inicializarForm();
  }
  
  inicializarForm() {
    this.fechainicio=null;
    this.fechafin=null;
    this.mainForm = this.formBuilder.group({
      'servicio': [''],
      'fechainicio': [''],
      'fechafin': [''],
     'buque': [''],
      'buqueBandera': ['']
    })}
  ionViewDidEnter() {
        this.cargarDatos();
        this.fechafin = null;
        // this.fechaInicioTemp = null;
        // this.fechaABordoTemp = null;
        this.fechainicio = null;
        

  }
  cargarDatos(){
    const datos = { login:this.settings.getValue(SettingsService.setting_User) ,servicio:this.mainForm.value.servicio,fechafin:this.fechafin,fechainicio:this.fechainicio,buque:this.mainForm.value.buque,buqueBandera:this.mainForm.value.buqueBandera };
    this.api.post("api/historico",datos ).subscribe((data) => {
      console.log("Busca historico :",data)    
      this.servicios=data;      
      }    
      ,
      (err: any) => {
        var respuesta = JSON.parse(JSON.stringify(err));
        console.log("Error ", respuesta)     

      }
    );

  }

}


// if (this.FechaInicioNavegacionTemp != null)
        // this.serviciodesdeApi.fechaInicioNavegacion = this.FechaInicioNavegacionTemp.replace("T", " ");