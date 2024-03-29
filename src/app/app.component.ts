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

  UsuarioNombre;
  FechaUltimaConexionConApi;

  constructor(
    private platform: Platform,
    private auth: AuthService,
    private router: Router
    , private settings: SettingsService,
    private fcmService: FcmService,
    private db: DbService
  ) {

    this.settings.fetchUserNameGet().subscribe(res=>{
      this.UsuarioNombre=res
    })

    this.settings.fetchUltimaConexionApiGet().subscribe(res=>{
      this.FechaUltimaConexionConApi=res
    })
    //this.FechaUltimaConexionConApi=this.settings.getValue(SettingsService.setting_UltimaConexionApi);
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

  irServicio() {
    this.router.navigateByUrl('tabs/servicio');//Guardia
 }
  irHistorico() {
    this.router.navigateByUrl('tabs/historico');//Guardia

 }
 async  irGuardia() {
//    this.router.navigateByUrl('tabs/guardia');//Guardia
    await Browser.open({ 'url': this.settings.getUrlGuardia() });
 }


  async irClima() {
    let parurl = "https://www.smn.gob.ar/pronostico"
    if (parurl.includes("////") || parurl.includes("\\\\")) {

      parurl = parurl.replace("////", "//").replace("\\\\", "\\")
    }

    await Browser.open({ 'url': parurl });
  }
  async irAlturaHoraria() {
    let parurl = "http://www.hidro.gov.ar/oceanografia/alturashorarias.asp"
    if (parurl.includes("////") || parurl.includes("\\\\")) {

      parurl = parurl.replace("////", "//").replace("\\\\", "\\")
    }

    await Browser.open({ 'url': parurl });
  }
  async irPronosticoMareologico() {
    let parurl = "http://www.hidro.gob.ar/oceanografia/pronostico.asp"
    if (parurl.includes("////") || parurl.includes("\\\\")) {

      parurl = parurl.replace("////", "//").replace("\\\\", "\\")
    }

    await Browser.open({ 'url': parurl });
  }
  async irProfundidadesMinimas() {
    let parurl = "https://www.argentina.gob.ar/puertos-vias-navegables-y-marina-mercante/planilla-de-determinantes"
    if (parurl.includes("////") || parurl.includes("\\\\")) {

      parurl = parurl.replace("////", "//").replace("\\\\", "\\")
    }

    await Browser.open({ 'url': parurl });
  }
  async irAIS() {
    let parurl = "https://ais.prefecturanaval.gob.ar"
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
    this.settings.setValue(SettingsService.setting_Token, null);
    this.settings.setValue(SettingsService.setting_TokenExpiresIn, null);
    this.settings.setValue(SettingsService.setting_UserPracticoId, null);
   
    
    this.settings.fetchUltimaConexionApiSet(null);
    this.settings.fetchUserNameSet(null);
    

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
  ionViewDidEnter() {
  }
  // initializeApp() {
  // } 
}


