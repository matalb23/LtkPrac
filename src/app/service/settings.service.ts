import { Injectable } from '@angular/core';
import { ToastController  } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SettingsService  {constructor(
  private toastCtrl: ToastController,
) {

  
 

}
UltimaConexionApi = new BehaviorSubject([]);
UserName = new BehaviorSubject([]);

  public static setting_Token="ACCESS_TOKEN";
  public static setting_TokenExpiresIn="EXPIRES_IN";
  public static setting_User="USER";
  //public static setting_UserName="USERNAME";
  public static setting_UserPracticoId="USER_PRACTICOID";
  public static setting_UserPass="pass";
  public static setting_TokenFCM="setting_TokenFCM";
  public static setting_Interceptor_ShowToast="setting_Interceptor_ShowToast";
  public static setting_UserNameDateOfLogin="setting_UserNameDateOfLogin";
  public static setting_TokenExpiresTokenDate="EXPIRES_TokenDate";
  public static setting_PracticoConServicio="0";
  public static setting_ServiciosCantidad="0";
  public static setting_NetworkConnected="setting_NetworkConnected";
  //public static setting_UltimaConexionApi="setting_UltimaConexion";
  // public  templateForm :any;
 
  logout()
  {
    
    window.localStorage.removeItem(SettingsService.setting_Token);
    window.localStorage.removeItem(SettingsService.setting_TokenExpiresIn);
  }
  setValue(key: string, value: any) {

    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }

  getValue(key: string) {
     return localStorage.getItem(key);
  }
  getUrlGuardia()
  { return "http://ltkprac.riopar.com.ar/autologin?login=guardia&password=Multi2021$"}



  public Interceptor_DontShowToast() {
    window.localStorage.removeItem(SettingsService.setting_Interceptor_ShowToast);
    window.localStorage.setItem(SettingsService.setting_Interceptor_ShowToast, '0');
  }

  async Toast_presentError(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      color: 'danger',
      cssClass: 'toast'
       //showCloseButton: true,
    //   closeButtonText: "OK",
    });
    toast.present();                     
}   
async Toast_presentWarnig(msg) {
  const toast = await this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'top',
    color: 'warning',
    cssClass: 'toast'
     //showCloseButton: true,
  //   closeButtonText: "OK",
  });
  toast.present();                     
}  
async Toast_presentSuccess(msg) {
  const toast = await this.toastCtrl.create({
    message: msg,
    duration: 3000,
    position: 'top',
    color: 'success',
    cssClass: 'toast'
     //showCloseButton: true,
  //   closeButtonText: "OK",
  });
  toast.present();                     
}  
fetchUltimaConexionApiGet(): Observable<any> {
  return this.UltimaConexionApi.asObservable();
}
fetchUltimaConexionApiSet( fecha) {
  //if(fecha!=null)
  

  this.UltimaConexionApi.next(fecha);
}
fetchUserNameGet(): Observable<any> {
  return this.UserName.asObservable();
}
fetchUserNameSet(name) {
  this.UserName.next(name);
}

}
