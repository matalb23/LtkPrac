
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, empty, of, throwError, Observer } from 'rxjs';
import { Router } from "@angular/router";
import { User } from './user';
import { AuthResponse } from './auth-response';
import { ApiService } from '../service/api.service';
import { SettingsService } from '../service/settings.service';
import { DbService } from '../service/db.service';
import { eachWeekOfIntervalWithOptions } from 'date-fns/fp';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubject = new BehaviorSubject(false);
  Servicio: number = 0;
  constructor(private api: ApiService, private settings: SettingsService, private httpClient: HttpClient, private db: DbService, private router: Router) {
  }
  isLoggedIn() : Observable<boolean> {
    return this.authSubject.asObservable();
   }

  login(user: User): any {
    this.Servicio = Number(this.settings.getValue(SettingsService.setting_ServiciosCantidad))
    //let logueo=false;
    this.settings.setValue(SettingsService.setting_PracticoConServicio, 0)
    if (user.login != this.settings.getValue(SettingsService.setting_User)) {
      this.settings.setValue(SettingsService.setting_UserNameDateOfLogin, null)
      this.settings.setValue(SettingsService.setting_TokenExpiresTokenDate, null)
    }
    let sUserNameDateOfLogin = this.settings.getValue(SettingsService.setting_UserNameDateOfLogin)
    let dateExpire = this.settings.getValue(SettingsService.setting_TokenExpiresTokenDate)
    console.log("setting_TokenExpiresTokenDate", sUserNameDateOfLogin)
    if (sUserNameDateOfLogin != null && dateExpire != null) {// se logueo aunque sea una vez previamente
      var now = new Date();
      if (now > new Date(dateExpire))//expiro el token
      {
        console.log(" if (now > new Date(dateExpire))//expiro el token")
        this.LoginWithApi(user);
      }


      let date1: Date = new Date();
      let date2: Date = new Date(sUserNameDateOfLogin);
      let timeInMilisec: number = date1.getTime() - date2.getTime();
      let daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));


      this.settings.setValue(SettingsService.setting_PracticoConServicio, 1)
      
      if (daysBetweenDates <= 5) {//Tenga servicio en bd interna y chequea que por los menos se haya logueado previamente y no mas de 5 dias

        console.log("daysBetweenDates <= 5: daysBetweenDates=", daysBetweenDates, "Servicios", this.Servicio)
        this.router.navigateByUrl("tabs")
        this.authSubject.next(true);
      }
      else {
        console.log("NO daysBetweenDates <= 5: daysBetweenDates=", daysBetweenDates, "Servicios", this.Servicio)
        this.LoginWithApi(user);
      }

    }
    else {
      this.LoginWithApi(user);
     
    }
  }
  LoginWithApi(user: User): any {    
    var data = "grant_type=password&UserName=" + user.login + "&Password=" + user.password + "&client_id=_Latika1234$_";
    console.log("LoginWithAp funcion", user, data)
    //this.settings.Interceptor_DontShowToast();
    this.api.post('token', data).subscribe((res: any) => {

      if (res.access_token) {
        this.settings.setValue(SettingsService.setting_Token, res.access_token);
        this.settings.setValue(SettingsService.setting_TokenExpiresIn, res.expires_in);
        var dateExpire = new Date();
        dateExpire.setSeconds(dateExpire.getSeconds() + res.expires_in - 10);
        console.log(dateExpire, dateExpire);
        this.settings.setValue(SettingsService.setting_TokenExpiresTokenDate, dateExpire);
        console.log("user login", user.login);
        this.settings.setValue(SettingsService.setting_User, user.login);

        this.settings.setValue(SettingsService.setting_UserPass, user.password);
        this.settings.setValue(SettingsService.setting_UserNameDateOfLogin, new Date())

        this.api.get("api/usuario?login=" + this.settings.getValue(SettingsService.setting_User)).subscribe(( data:any) => {
          console.log("datos del usuario",data)
          this.settings.setValue(SettingsService.setting_UserName, data.name);
          this.settings.setValue(SettingsService.setting_UserPracticoId, data.practicoId);     
          this.db.deleteAllTipoDemora().then(res => {            
          for (let tipo of data.tipoDemora) {
           console.log( "data.tipoDemora",data.tipoDemora)
              this.db.addTipoDemora(tipo).then(res => { })
                .catch(e => {
                  console.log("error this.db.addTipoDemora", e);
                })           
              .catch(e => {
                console.log("error this.db.deleteAllTipoDemora", e);
              });  
          }
        })//elimino previante los ue vinieon de la api y los vuelvo a poner  


          this.db.deleteAllTipoManiobra().then(res => {    
            console.log( "data.tipoManiobra",data.tipoManiobra)
          for (let tipo of data.tipoManiobra) {                   
              this.db.addTipoManiobra(tipo).then(res => { })
                .catch(e => {
                  console.log("error this.db.addTipoManiobra", e);
                })            
              .catch(e => {
                console.log("error this.db.deleteAllTipoManiobra", e);
              });  
          }
        })//elimino previante los ue vinieon de la api y los vuelvo a poner  

        })

        this.authSubject.next(true);
        console.log("logeo en api")
        this.router.navigateByUrl("tabs/servicio")////va al servicio para refresque la bd local porque home solo usa bd local no usa api
        return true

      }
      else {
        console.log("funcion login fue al else");
      }

      throw throwError("no logueo en la api");

    }
      , catchError((error: HttpErrorResponse) => {
        this.router.navigateByUrl('login');
        console.error("error en auth", error);

        return throwError(error);
      })

    );

    this.router.navigateByUrl("login")
    return
  }
  async logout() {
    this.settings.logout();
    this.authSubject.next(false);
  }
}