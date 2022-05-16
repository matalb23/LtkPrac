// import { Component } from '@angular/core';
// import { Router } from  "@angular/router";
// import { AuthService } from '../auth.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";
import { SettingsService } from '../../service/settings.service';
import { User } from '../user';
import { FcmService } from '../../service/fcm.service';
 import { DbService } from '../../service/db.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage     {


  constructor(private  authService:  AuthService, private  router:  Router,
    private platform: Platform   
    
    , private settings: SettingsService,
    private fcmService: FcmService,
     private db: DbService
    ) { 


    }

  login(form){   

    
    this.authService.login(form.value)/*.subscribe((res)=>{    
      console.log("login.ts",res )
      if(this.settings.getValue(SettingsService.setting_User)!=null)
      {
       this.router.navigateByUrl("tabs")
 
      }
      
    })
    */
    
    /*,
    catchError((error: HttpErrorResponse) => {
      console.log("error this.authService.login",error)
      return throwError(error);
    })
    ;*/
   
  }

}
