import { Component, OnInit,ViewChild  } from '@angular/core';
import { ApiService } from '../service/api.service';
import { SettingsService } from '../service/settings.service';
@Component({
  selector: 'app-guardia',
  templateUrl: './guardia.page.html',
  styleUrls: ['./guardia.page.scss'],
})
export class GuardiaPage implements OnInit {
  guardia;
  constructor(
    private settings: SettingsService,
    private api: ApiService

  ) { }

  ngOnInit() {
  }
  ionViewDidEnter() {

        this.cargarDatos();

  }
  cargarDatos(){


    this.api.get("api/guardia?tipo=todos" ).subscribe((data) => {
      console.log("Busca guardia :",data)    
      this.guardia=data;
      
      }
    
      ,
      (err: any) => {

        var respuesta = JSON.parse(JSON.stringify(err));
        console.log("Error ", respuesta)
      

      }
    );

  }
}
