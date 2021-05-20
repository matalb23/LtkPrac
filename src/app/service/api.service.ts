import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { templateJitUrl } from '@angular/compiler';
  const cabecera = {headers: new HttpHeaders({'Content-TYpe': 'application/json'})};


@Injectable({
  providedIn: 'root'
})
export class ApiService {

 // url: string = "http://apptkapi.latikait.com.ar";
  url: string = "http://10.0.0.90:45457";

  constructor(public http: HttpClient) { }
  
  get(endpoint: string, params?: any, reqOpts?: any) {
    
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

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
  post2(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post<any>(this.url + '/' + endpoint, body, cabecera);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}
