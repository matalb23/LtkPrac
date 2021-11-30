import { Injectable } from '@angular/core';
import {ApiService} from '../service/api.service';
import {SettingsService} from '../service/settings.service';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
 import { tap } from  'rxjs/operators';
// import { dateValueRange } from 'node_modules_x/@ionic/core/dist/types/components/datetime/datetime-util';
import { Router } from '@angular/router';
 
const { PushNotifications } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private api:ApiService,private settings:SettingsService,private router:Router) { }
  initPush() {

    
    console.log('FcmService');
   

    if (Capacitor.platform !== 'web') {
      console.log('FcmService no es web');
      const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
      if (isPushNotificationsAvailable) {
        //alert("aa");
        this.registerPush();
      }
    }
  }
  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.log('No permission for push granted');
        // No permission for push granted
      }
    });
 
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        this.settings.Interceptor_DontShowToast();
        this.settings.setValue(SettingsService.setting_TokenFCM,token);

        var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "mobile_so": "'+ Capacitor.platform.substr(0) + '", "mobile_token": "'+token.value+'" }';
        
       // console.log('api datas: ' + JSON.stringify(data)); 
       
        this.api.post2('api/mensajeT',data).subscribe((result) => {
          var respuesta=JSON.parse(JSON.stringify(result)); 
          console.log('api grabo token fcm: ' + respuesta); 
        });


      //  console.log('My token: ' + JSON.stringify(token));
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
 
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;

        console.log('Action performed: ' + JSON.stringify(data));
      //  if (data.detailsId) {
          //this.router.navigateByUrl(`/mensaje/`);
          this.router.navigate(['/mensaje/']);
        //}
      }
    );
  }
}
