import { Component, OnInit,ViewChild  } from '@angular/core';
import { ApiService } from '../service/api.service';
import { SettingsService } from '../service/settings.service';
@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
  servicios;
  constructor(
        private api: ApiService,
        private settings: SettingsService,
  ) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
        this.cargarDatos();
  }
  cargarDatos(){
    this.api.get("api/historico?login="+this.settings.getValue(SettingsService.setting_User) ).subscribe((data) => {
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
