
import{ApiService} from '../service/api.service';
import{SettingsService} from '../service/settings.service';
import { Router } from  "@angular/router";
import { Component  } from '@angular/core';
import { FcmService } from '../service/fcm.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private api:ApiService,private settings:SettingsService, private  router:  Router  , private fcmService: FcmService, private platform: Platform  ) {
    //+ this.ngOnInit();
 
   }
  async ionViewDidEnter(){

  
    this.platform.ready().then(() => {
   this.fcmService.initPush();
  });
   
  }
  
}
