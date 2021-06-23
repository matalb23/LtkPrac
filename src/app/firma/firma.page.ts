import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DbService } from '../service/db.service';

import { Firma } from '../service/firma';
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
@Component({
  selector: 'app-firma',
  templateUrl: 'firma.page.html',
  styleUrls: ['firma.page.scss']
})
export class FirmaPage implements OnInit, AfterViewInit {
  
  @ViewChild('canvas', { static: true }) signaturePadElement;
  firma:Firma=null;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;

  constructor(private elementRef: ElementRef,
    private base64ToGallery: Base64ToGallery, private androidPermissions: AndroidPermissions
    , private db: DbService,
    private toast: ToastController,
    private router: Router,
    private settings: SettingsService,
    private api: ApiService
  ) { }

  ngOnInit(): void {

  


    this.init();
  }
  ionViewDidEnter(){
   this.buscarfirma();
  }
   buscarfirma(){
    
    this.db.fetchSinFirmar().subscribe(res => {
      this.firma=res
      if (this.firma==null)
      {
        this.router.navigate(['tabs/servicio']);
      }
    })
      

 
    
    
    
   /* this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchFirmas().subscribe(item => {          
          console.log(" fetchFirmasitem",item);
          if(item.length>0)
          {
              for(let i=0;i< item.length;i++)
              {
                  
                  if (item[i].firma == null )             
                  { 
                    console.log("value",item[i]);
                    this.firma = <Firma>item[i];
                    break;
                  }
              }
              console.log("this.firma",this.firma);
          }
         if (this.firma==null)
         {
          this.router.navigate(['tabs/servicio']);
         }
        })
      }
    });*/
    

  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init();
  }

  init() {
    //this.buscarfirma();

    const canvas: any = this.elementRef.nativeElement.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 140;
    if (this.signaturePad) {
      this.signaturePad.clear(); // Clear the pad on init
    }
  }

  public ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    this.signaturePad.clear();
    this.signaturePad.penColor = 'rgb(56,128,255)';
  }

  // save(): void {
  //   const img = this.signaturePad.toDataURL();
  //   this.base64ToGallery.base64ToGallery(img).then(
  //     res => console.log('Saved image to gallery ', res),
  //     err => console.log('Error saving image to gallery ', err)
  //   );
  // }
  save(): void {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          const img = this.signaturePad.toDataURL();
          this.base64ToGallery.base64ToGallery(img).then(

            res => {console.log('Saved image to gallery ', res)
            this.firma.firma=res;
            this.firma.firmaFecha= new Date();
            this.firma.latitude=0;
            this.firma.longitude=0;

             this.db.updateFirma(this.firma).then((res)=>{
               console.log("updatefirma res:",res);
             
              this.clear();
              //this.buscarfirma();
              this.router.navigate(['/firma']);

             });
             
            }
             
             ,
            err => console.log('Error saving image to gallery ', err)
          );
        }
        else {
          this.requestPermissions();
        }
      },
      err => this.requestPermissions()
    );
    // this.clear();
    // this.buscarfirma();  
    // this.router.navigate(['/firma']);
  }

  requestPermissions() {
    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
      .then(
        res => {
          console.log('Saved image to gallery ', res);
          this.save();
        },
        err => console.log('Error saving image to gallery ', err)
      );
  }

  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }

  clear() {
    this.firma=null;
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }
}