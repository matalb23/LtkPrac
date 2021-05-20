import { Component } from '@angular/core';
import{ApiService} from '../service/api.service';
import{SettingsService} from '../service/settings.service';

import { Router } from  "@angular/router";

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.page.html',
  styleUrls: ['./mensaje.page.scss'],
})
export class MensajePage  {constructor(private api:ApiService,private settings:SettingsService, private  router:  Router) { }
mensajes:any;

async opepdf(id) { 
 this.router.navigate(['/ver-tk/'+id]);
}
getMensajes(){

   this.api.get("api/mensaje" + "?login=" + this.settings.getValue(SettingsService.setting_User) ).subscribe((data)=> {
    this.mensajes=data;      
         }
   ,
     (err: any) => {
     
       var respuesta=JSON.parse(JSON.stringify(err));   
       
     }
   );
   
 }
 ionViewDidEnter(){
  this.getMensajes();
}

}
