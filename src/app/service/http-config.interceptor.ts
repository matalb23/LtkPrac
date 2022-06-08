import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service'
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  isLoading: boolean = false;
  isUpload: boolean = false;
  constructor(
    private settings: SettingsService,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) { }
  intercept(req: HttpRequest<any>,
    next: HttpHandler):
    Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.settings.getValue(SettingsService.setting_Token);
    //&&  !req.url.includes("assets/dump.sql")
    if (!req.url.includes("/token")) {
      {
        console.log("HttpInterceptor_url:" + req.url + " Bearer");
        authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
      }
    }

    this.isUpload = req.url.includes("/servicio/upload");

    this.presentLoading();
    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

          if (this.isUpload && this.settings.getValue(SettingsService.setting_Interceptor_ShowToast) == '1')
            this.settings.Toast_presentSuccess("Guardo y Sincronizó con exito");

          this.settings.setValue(SettingsService.setting_Interceptor_ShowToast, '1');

          // Cerramos el loading en el fin de la llamada
          this.dismissLoading();
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        console.error("Interceptor catchError((error: HttpErrorResponse)", error);
        this.dismissLoading();
        const ShowToast = this.settings.getValue(SettingsService.setting_Interceptor_ShowToast);
        if (ShowToast == '0') {
          this.settings.setValue(SettingsService.setting_Interceptor_ShowToast, '1');
        }
        else {
          if (this.isUpload)
            this.settings.Toast_presentWarnig("Guardo con éxito, sin Sincronizar");
          else
            this.settings.Toast_presentError('Ups, ha habido un problema');
        }

        return throwError(error);
      })
    );
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      duration: 3000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log());
        }
      });
    });
  }
  // Cierre del loading
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() =>
      null);
  }

}