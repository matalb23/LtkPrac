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

    if (!req.url.includes("/token")) {
      {
        console.log("HttpInterceptor_url:" + req.url + " Bearer");
        authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
      }
    }

    this.presentLoading();
    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Cerramos el loading en el fin de la llamada
          this.dismissLoading();
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

       // console.error(error);        
        this.dismissLoading();
        const ShowToast = this.settings.getValue(SettingsService.setting_Interceptor_ShowToast);
        if (ShowToast=='0')
        {
          this.settings.setValue(SettingsService.setting_Interceptor_ShowToast,'1');
        }
        else
        {
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