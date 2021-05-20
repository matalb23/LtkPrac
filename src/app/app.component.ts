import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from "@angular/router";
import { SettingsService } from './service/settings.service';
import { User } from './auth/user';
import { FcmService } from './service/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private auth: AuthService,
    private router: Router
    , private settings: SettingsService,
    private fcmService: FcmService

  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {


      this.auth.authSubject.subscribe(state => {
        if (state) {
          console.log("user is logged in");
          //    this.router.navigateByUrl('home');

        } else {
          console.log("user is NOT logged ");
          var user = {} as User;
          user.login = this.settings.getValue(SettingsService.setting_User);
          user.password = this.settings.getValue(SettingsService.setting_UserPass);
          if (user.login == null) {
            console.log("user no guardado");
            this.router.navigateByUrl('login');
          }
          else {
            this.auth.login(user).subscribe((res) => {
              this.router.navigateByUrl('home');
            }
              , error => {
                this.router.navigateByUrl('login');
              }
            );

          }



        }
      });


    });
  }
}
