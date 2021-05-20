import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
  public static setting_Token="ACCESS_TOKEN";
  public static setting_TokenExpiresIn="EXPIRES_IN";
  public static setting_User="USER";
  public static setting_UserName="USERNAME";
  public static setting_UserPass="pass";
  public static setting_TokenFCM="setting_TokenFCM";
  public  templateForm :any;

  
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


  public SetTemplateForm(valor){
    this.templateForm=valor;
  }
  public GetTemplateForm(){
    return this.templateForm;
  }
  public GetUrlBackend(){
    return "http://apptkweb.latikait.com.ar"
  }
}
