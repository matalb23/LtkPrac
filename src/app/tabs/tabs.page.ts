
import{ApiService} from '../service/api.service';
import{SettingsService} from '../service/settings.service';
import { Router } from  "@angular/router";
import { Component  } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FcmService } from '../service/fcm.service';
import { Platform } from '@ionic/angular';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  NetworkStatus;
  constructor(private api:ApiService,private settings:SettingsService, private  router:  Router  , private menu: MenuController, private fcmService: FcmService, private platform: Platform  ) {
    //+ this.ngOnInit();
    Network.addListener('networkStatusChange', status => {
      this.NetworkStatus=status;
      console.log('Network status changed', status);
    });
    
   }
   openMenu() {
    this.menu.enable(true, 'first'); 
    this.menu.open('first');
  }
  async ionViewDidEnter(){

  

    this.platform.ready().then(() => {
      const logCurrentNetworkStatus = async () => {
        const status = await Network.getStatus();
      //  this.NetworkStatus=status;
        console.log('Network status:', status);
      }

      
      if (this.settings.getValue(SettingsService.setting_User)=="" ||  this.settings.getValue(SettingsService.setting_User)=="null" || this.settings.getValue(SettingsService.setting_User)==null)
      {
        this.settings.setValue(SettingsService.setting_User,null);
        this.router.navigateByUrl("login");
      }
      else{
          this.fcmService.initPushYGeo();
        }
  });
   
  }
  
}
