import { Injectable } from '@angular/core';
import {ApiService} from '../service/api.service';
import {SettingsService} from '../service/settings.service';
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

   
  }
  initPushYGeo() {

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
  
    console.log('ccCurrent position:', this.geo);
    var data = '{ "login": "'+this.settings.getValue(SettingsService.setting_User) +'", "practico": "'+ this.settings.getValue(SettingsService.setting_UserPracticoId) + '", "descripcion": "inicio la aplicacion","latitude":"'+position.coords.latitude+'","longitude":"'+position.coords.longitude +'"}';
    console.log("begin api/geolocalizacion",data)
    this.api.post2('api/geolocalizacion',data).subscribe((result) => {
      var respuesta=JSON.parse(JSON.stringify(result)); 
      console.log('api grabo token fcm: ' + respuesta); 
    });

  }
    
}