import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {AuthModule} from './auth/auth.module';
import {SettingsService} from './service/settings.service';

import { HttpConfigInterceptor } from './service/http-config.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { FormsModule } from '@angular/forms'  
import { ReactiveFormsModule} from '@angular/forms' 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AuthModule, ReactiveFormsModule, 
   FormsModule],
  providers: [//AndroidPermissions,Base64ToGallery
    ,SettingsService,SQLite, SQLitePorter,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  },
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {

  
}
