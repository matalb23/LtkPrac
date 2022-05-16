import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
const cabecera = { headers: new HttpHeaders({ 'Content-TYpe': 'application/json' }) };
import { Network } from '@capacitor/network';
import { EMPTY } from 'rxjs';
import { SettingsService } from './settings.service'
@Injectable({
  providedIn: 'root'
})
export class ApiService {

   //url: string = "http://10.0.0.33:45455"; desa 
  
  url: string = "https://constancias.riopar.com.ar";//multipar real

  constructor(public http: HttpClient, public settings: SettingsService) { }

  NetworkConnected() {
    return 1;
  }
  //  NetworkConnected() {
  //   console.log(" this.settings.getValue(SettingsService.setting_NetworkConnected)", this.settings.getValue(SettingsService.setting_NetworkConnected));
  //   return Number(this.settings.getValue(SettingsService.setting_NetworkConnected))
  // }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (this.NetworkConnected()==1)//si esta conectado a la red
    {
      console.log("get ")
      if (!reqOpts) {
        reqOpts = {
          params: new HttpParams()
        };
      }

      // Support easy query params for GET requests
      if (params) {
        reqOpts.params = new HttpParams();
        for (let k in params) {
          reqOpts.params = reqOpts.params.set(k, params[k]);
        }
      }

      return this.http.get(this.url + '/' + endpoint, reqOpts);
    }
    else {
      console.log("GET no tiene red")
      this.settings.Toast_presentWarnig("No posee red para poder traer la informacion del servidor")
      return EMPTY;
    }

  }

  get2(endpoint: string) {
    return  this.http.get(this.url + '/' + endpoint, cabecera)
      }

  post(endpoint: string, body: any, reqOpts?: any) {
    if (this.NetworkConnected()==1)//si esta conectado a la red
    {
      console.log("Post ")
      return this.http.post(this.url + '/' + endpoint, body, reqOpts);
    }
    else {
      console.log("Post no tiene red")
      this.settings.Toast_presentWarnig("No posee red para poder enviar la informacion al servidor")
      return EMPTY;
    }
  }
  post2(endpoint: string, body: any, reqOpts?: any) {
  return  this.post(endpoint,body,cabecera)
    }
  // post2(endpoint: string, body: any, reqOpts?: any) {
  //   if (this.NetworkConnected())//si esta conectado a la red
  //   {
  //     return this.http.post<any>(this.url + '/' + endpoint, body, cabecera);
  //   }

  //   else {
  //     console.log("no tiene red")
  //     return EMPTY;
  //   }
  // }

  // put(endpoint: string, body: any, reqOpts?: any) {
  //   return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  // }

  // delete(endpoint: string, reqOpts?: any) {
  //   return this.http.delete(this.url + '/' + endpoint, reqOpts);
  // }

  // patch(endpoint: string, body: any, reqOpts?: any) {
  //   return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  // }
}
