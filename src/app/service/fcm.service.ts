import { Injectable } from '@angular/core';
import {ApiService} from '../service/api.service';
import {SettingsService} from '../service/settings.service';
//import { Network } from '@capacitor/network';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AuthService } from '../auth/auth.service';
import { 
  Capacitor
} from '@capacitor/core';
 
import { Router } from '@angular/router';
 
import { PushNotifications } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
public  geo:Position;
  constructor(private api:ApiService,private settings:SettingsService,private router:Router,private authService:AuthService) {

    this.authService.isLoggedIn().subscribe({
      next: result => {
        if ( result==true)
        {
          this.getLocation();
        }
      }
  });

   
    //   this.geo = await Geolocation.getCurrentPosition(result=>{});
    //  //this.geo= coordinates;
    //    console.log('ccCurrent position:', this.geo);
    //    var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "practico": "'+ this.settings.getValue(SettingsService.setting_UserPracticoId) + '", "descripcion": "inicio la aplicacion","latitude":"'+this.geo.coords.latitude+'","longitude":"'+this.geo.coords.longitude +'"}';
    //    console.log("begin api/geolocalizacion",data)
    //    this.api.post2('api/geolocalizacion',data).subscribe((result) => {
    //      var respuesta=JSON.parse(JSON.stringify(result)); 
    //      console.log('api grabo token fcm: ' + respuesta); 
    //    });
    //  };
    //  printCurrentPosition()
  
  }
  initPushYGeo() {

    //  const printCurrentPosition = async () => {
    //   Geolocation.getCurrentPosition().then(result=>{
    //     console.log('ccCurrent position:', this.geo);
    //     var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "practico": "'+ this.settings.getValue(SettingsService.setting_UserPracticoId) + '", "descripcion": "inicio la aplicacion","latitude":"'+result.coords.latitude+'","longitude":"'+result.coords.longitude +'"}';
    //     console.log("begin api/geolocalizacion",data)
    //     this.api.post2('api/geolocalizacion',data).subscribe((result) => {
    //       var respuesta=JSON.parse(JSON.stringify(result)); 
    //       console.log('api grabo token fcm: ' + respuesta); 
    //     });

    //   })}
    //   printCurrentPosition();
    //printCurrentPosition();
    // Network.addListener('networkStatusChange', status => {
    //   console.log('Network status changed', status);
    //   this.settings.setValue(SettingsService.setting_NetworkConnected,status.connected === true ? 1 : 0  );
    // });
    
    console.log("Entro a clase fcm")
    const addListeners = async () => {
      await PushNotifications.addListener('registration', token => {
        this.settings.Interceptor_DontShowToast();
        this.settings.setValue(SettingsService.setting_TokenFCM,token);

        var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "mobile_so": "'+ Capacitor.platform.substr(0) + '", "mobile_token": "'+token.value+'" }';
       console.log("begin api/mensajeT",data)
        this.api.post2('api/mensajeT',data).subscribe((result) => {
          var respuesta=JSON.parse(JSON.stringify(result)); 
          console.log('api grabo token fcm: ' + respuesta); 
        });

        

      
      });

   

  
      await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });
    
      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
      });
    
      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        this.router.navigate(['/mensaje/']);
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });
    }
    const registerNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();
    
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
    
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }
    
      await PushNotifications.register();
    }
    
    const getDeliveredNotifications = async () => {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
    }

    addListeners();
    getDeliveredNotifications();
    registerNotifications();
   
   }
  

   async getLocation() {
    console.log('GET LOCATION');
    const position = await Geolocation.getCurrentPosition();
    console.log('POSICION: ', position);
    // this.latitude = position.coords.latitude;
    // this.longitude = position.coords.longitude;
    // console.log('this.latitude ' + this.latitude);
    console.log('ccCurrent position:', this.geo);
    var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "practico": "'+ this.settings.getValue(SettingsService.setting_UserPracticoId) + '", "descripcion": "inicio la aplicacion","latitude":"'+position.coords.latitude+'","longitude":"'+position.coords.longitude +'"}';
    console.log("begin api/geolocalizacion",data)
    this.api.post2('api/geolocalizacion',data).subscribe((result) => {
      var respuesta=JSON.parse(JSON.stringify(result)); 
      console.log('api grabo token fcm: ' + respuesta); 
    });

  }
    
  //   console.log('FcmService');
   

  //   if (Capacitor.platform !== 'web') {
  //     console.log('FcmService no es web');
  //     const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
  //     if (isPushNotificationsAvailable) {
  //       //alert("aa");
  //       this.registerPush();
  //     }
  //   }
  // }
  // private registerPush() {
  //   PushNotifications.requestPermission().then((permission) => {
  //     if (permission.granted) {
  //       // Register with Apple / Google to receive push via APNS/FCM
  //       PushNotifications.register();
  //     } else {
  //       console.log('No permission for push granted');
  //       // No permission for push granted
  //     }
  //   });
 
  //   PushNotifications.addListener(
  //     'registration',
  //     (token: PushNotificationToken) => {
  //       this.settings.Interceptor_DontShowToast();
  //       this.settings.setValue(SettingsService.setting_TokenFCM,token);

  //       var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "mobile_so": "'+ Capacitor.platform.substr(0) + '", "mobile_token": "'+token.value+'" }';
        
  //      // console.log('api datas: ' + JSON.stringify(data)); 
       
  //       this.api.post2('api/mensajeT',data).subscribe((result) => {
  //         var respuesta=JSON.parse(JSON.stringify(result)); 
  //         console.log('api grabo token fcm: ' + respuesta); 
  //       });


  //     //  console.log('My token: ' + JSON.stringify(token));
  //     }
  //   );
 
  //   PushNotifications.addListener('registrationError', (error: any) => {
  //     console.log('Error: ' + JSON.stringify(error));
  //   });
 
  //   PushNotifications.addListener(
  //     'pushNotificationReceived',
  //     async (notification: PushNotification) => {
  //       console.log('Push received: ' + JSON.stringify(notification));
  //     }
  //   );
 
  //   PushNotifications.addListener(
  //     'pushNotificationActionPerformed',
  //     async (notification: PushNotificationActionPerformed) => {
  //       const data = notification.notification.data;

  //       console.log('Action performed: ' + JSON.stringify(data));
  //     //  if (data.detailsId) {
  //         //this.router.navigateByUrl(`/mensaje/`);
  //         this.router.navigate(['/mensaje/']);
  //       //}
  //     }
  //   );
  // }
}