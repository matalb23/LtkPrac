import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from "@angular/router";
import { SettingsService } from './service/settings.service';
import { User } from './auth/user';
import { FcmService } from './service/fcm.service';
import { DbService } from './service/db.service';
import { Browser } from '@capacitor/browser';

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
    private fcmService: FcmService,
    private db: DbService
  ) {

    // this.db.fetchServicios().subscribe(Servicios => {//s solo para saber si esta en la bd

    //   console.log("Servicios.length;",Servicios.length)
    // })

    this.platform.ready().then(() => {
      
  
      var user = {} as User;
      user.login = this.settings.getValue(SettingsService.setting_User);
      user.password = this.settings.getValue(SettingsService.setting_UserPass);

      if (user.login == null) {
        console.log("user no guardado,user", user);
        this.router.navigateByUrl('login');
      }
      else {
        this.auth.login(user).subscribe((res) => {
          console.log("   this.auth.login(user).subscribe((res) => {")
          this.router.navigateByUrl('tabs/servicio');//home

          this.fcmService.getLocation();
        }
          , error => {
            this.router.navigateByUrl('login');
          }
        );

      }


    });
  }
  async irClima() {
    let parurl = "https://www.smn.gob.ar/pronostico"
    if (parurl.includes("////") || parurl.includes("\\\\")) {

      parurl = parurl.replace("////", "//").replace("\\\\", "\\")
    }

    await Browser.open({ 'url': parurl });
  }
  NoImplementado() {
    this.settings.Toast_presentWarnig("Metodo no Implementado.");

  }
  cerrarSesion() {
    this.settings.setValue(SettingsService.setting_User, null);
    this.settings.setValue(SettingsService.setting_UserPass, null);
//hago lo siguiente para que la apk reconstruya la bd si es que hubo cambios en la bd
    this.db.deleteDatabase();/*.then(res => {
      console.log("dropTable  res",res)
      this.router.navigateByUrl('login');
    })
    .catch(e => {
      console.log("error llamar delete",e);
  });
*/
this.router.navigateByUrl('login');

  }
  // initializeApp() {
  // }
}
