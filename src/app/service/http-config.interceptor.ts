import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
  //import { Storage } from '@ionic/storage'
  import { Observable, throwError, from} from 'rxjs';
  import { map, catchError, switchMap } from 'rxjs/operators';
  import { Injectable } from '@angular/core';
  import {SettingsService} from './settings.service'
  import { LoadingController,ToastController  } from '@ionic/angular';
  //const TOKEN_KEY = 'token';
  @Injectable()
  export class HttpConfigInterceptor implements HttpInterceptor {
    isLoading: boolean = false;
    constructor(
    private settings:SettingsService,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,

    ) { }
    intercept(req: HttpRequest<any>, 
                 next: HttpHandler): 
            Observable<HttpEvent<any>> 
            {
    
                let authReq = req;
                const token = this.settings.getValue(SettingsService.setting_Token);
                
                 
                 if(!req.url.includes("/token"))
                 {
                     {
                  
                   console.log("HttpInterceptor_url:"+req.url+ " Bearer");//+" token:"+token
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

                     console.error(error);
                     // En caso de error cerramos el loading
                     this.dismissLoading();
                     this.presentErrorToast('Ups, ha habido un problema');
                     return throwError(error);
                   })
                 );  
             // return next.handle(authReq);
               /* return next.handle(req).pipe(
                  map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                      // Cerramos el loading en el fin de la llamada
                      this.dismissLoading();
                    }
                    return event;
                  }),
                  catchError((error: HttpErrorResponse) => {
                    console.error(error);
                    // En caso de error cerramos el loading
                    this.dismissLoading();
                    return null;//throwError(error);
                  })
                );
            */
                
            
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
                null);//console.log('dismissLoading')
              }     
              async presentErrorToast(msg) {
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
            
            
    //         {
    //   return from(this.settings.getValue(SettingsService.setting_Token))
    //     .pipe(
    //       switchMap(token => {
    //         //   alert("HttpInterceptor:"+token);
    //  if(!request.url.includes("/token"))
    //  {
         
      
    //    console.log("HttpInterceptor_url:"+request.url);//+" token:"+token
    //    request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });            
        
    //  }
    //         // if (token) {
    //         //   request = request.clone(
    //         //     { 
    //         //     headers: request.headers.set('token', token) 
    //         //   });
    //         // }
            
    //         return next.handle(request).pipe(
    //           map((event: HttpEvent<any>) => {
    //             if (event instanceof HttpResponse) {
    //             }
    //             return event;
    //           }),
    //           catchError((error: HttpErrorResponse) => {
    //             console.error(error);
    //             return throwError(error);
    //           })
    //         );
    //       })
    //     );
    // }
  //}
        }