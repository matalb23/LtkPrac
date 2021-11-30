
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
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubject = new BehaviorSubject(false);
  constructor(private api: ApiService, private settings: SettingsService, private httpClient: HttpClient, private db: DbService, private router: Router) { }

  login(user: User): Observable<AuthResponse> {


    let sUserNameDateOfLogin = this.settings.getValue(SettingsService.setting_UserNameDateOfLogin)
    console.log("setting_UserNameDateOfLogin", sUserNameDateOfLogin)
    if (sUserNameDateOfLogin != null) {// se logueo aunque sea una vez previamente
     

      let date1: Date = new Date();
      let date2: Date = new Date(sUserNameDateOfLogin);
      let timeInMilisec: number = date1.getTime() - date2.getTime();
      let daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));

      this.db.fetchServicios().subscribe(Servicios => {//s solo para saber si esta en la bd

        if (Servicios.length > 0 && daysBetweenDates <= 5) {//Tenga servicio en bd interna y chequea que por los menos se haya logueado previamente y no mas de 5 dias
          this.authSubject.next(true);
          console.log("Servicios.length > 0 && daysBetweenDates <= 5", daysBetweenDates, Servicios.length)
        }
        else {
          console.log("NO Servicios.length > 0 && daysBetweenDates <= 5", daysBetweenDates, Servicios.length)
          return this.LoginWithApi(user);
        }
      })
      return new Observable((observer: any) => {
        observer.next();
        observer.complete();
      });

    }
    else
    {
      return this.LoginWithApi(user);
      //this.settings.Toast_presentError("No es posible validar su usuario")
    }



    //   return this.api.post('token', data).pipe(
    //     tap(async (res: any) => { 
    //      if (res.access_token) {      
    //       this.settings.setValue(SettingsService.setting_Token,res.access_token);
    //       this.settings.setValue(SettingsService.setting_TokenExpiresIn,res.expires_in);
    //       this.settings.setValue(SettingsService.setting_User,user.login);
    //       this.settings.setValue(SettingsService.setting_UserPass,user.password);
    //       this.authSubject.next(true);        
    //      }
    //      else{
    //        console.log("funcion login fue al else");
    //      }
    //    }     )
    //  );





  }
  LoginWithApi(user: User): Observable<AuthResponse> {
    console.log("LoginWithApi", user)
    var data = "grant_type=password&UserName=" + user.login + "&Password=" + user.password + "&client_id=_Latika1234$_";
    this.settings.Interceptor_DontShowToast();
    return this.api.post('token', data).pipe(
      map((res: any) => {

        if (res.access_token) {
          this.settings.setValue(SettingsService.setting_Token, res.access_token);
          this.settings.setValue(SettingsService.setting_TokenExpiresIn, res.expires_in);
          this.settings.setValue(SettingsService.setting_User, user.login);
          this.settings.setValue(SettingsService.setting_UserPass, user.password);
          this.settings.setValue(SettingsService.setting_UserNameDateOfLogin, new Date())
          this.authSubject.next(true);
        }
        else {
          console.log("funcion login fue al else");
        }
        return res
      }),
      catchError((error: HttpErrorResponse) => {


        console.error("error en auth", error);

        return throwError(error);
      })
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
