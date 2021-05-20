
import { Injectable } from  '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

//import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { AuthResponse } from  './auth-response';
import {ApiService} from '../service/api.service';
 import {SettingsService} from '../service/settings.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubject  =  new  BehaviorSubject(false);
  constructor(private api:ApiService,private settings:SettingsService,private httpClient:HttpClient ) { }

  login(user: User): Observable<AuthResponse> {
    var data = "grant_type=password&UserName="+user.login + "&Password="+user.password+"&client_id=_Latika1234$_";
     
    return this.api.post('token', data).pipe(
      tap(async (res: any) => { 
       if (res.access_token) {      
        this.settings.setValue(SettingsService.setting_Token,res.access_token);
        this.settings.setValue(SettingsService.setting_TokenExpiresIn,res.expires_in);
        this.settings.setValue(SettingsService.setting_User,user.login);
        this.settings.setValue(SettingsService.setting_UserPass,user.password);
        this.authSubject.next(true);        
       }
       else{
         console.log("funcion login fue al else");
       }
     }     )
   );

  }
  async logout() {
    this.settings.logout();
    this.authSubject.next(false);
  }
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
