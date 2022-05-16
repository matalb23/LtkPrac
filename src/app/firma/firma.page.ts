import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit, Input } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DbService } from '../service/db.service';
import { ActivatedRoute } from '@angular/router';
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
  
  firmanteTipo: string;
  constructor(private elementRef: ElementRef,
    private base64ToGallery: Base64ToGallery//, private androidPermissions: AndroidPermissions
    , private db: DbService,
    private toast: ToastController,
    private router: Router,
    private settings: SettingsService,
    private api: ApiService,
    private route: ActivatedRoute
  ) {
     this.route.params.subscribe(params => {
      this.firmanteTipo = params['firmanteTipo']; 
 });


   }
  ngOnInit(): void {
    this.init();
  }
  ionViewDidEnter(){
   this.buscarfirma();
  }
   buscarfirma(){
    this.db.fetchFirmas().subscribe(res => {
      res.forEach(firma => {
        if (firma.tipo ==this.firmanteTipo)
        {
          this.firma=firma
        }
      });
      
    })

    // this.db.fetchSinFirmar().subscribe(res => {
    //   this.firma=res
    //   if (this.firma==null)
    //   {
    //     this.router.navigate(['tabs/servicio']);
    //   }
    // })
      

  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.init();
  }

  init() {


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

  save(): void {
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
    //   result => {
    //     if (result.hasPermission) {
          const img = this.signaturePad.toDataURL();
         
          this.base64ToGallery.base64ToGallery(img).then(           

            res => {console.log('Saved image to gallery, path ', res)
            this.firma.firma=res;
            this.firma.firma=this.firma.codigo+"_T" +this.firma.tipo+".png"//nuevo

            this.firma.firmaFecha=  new Date().toLocaleString();//new Date();
            this.firma.latitude=0;
            this.firma.longitude=0;
            this.firma.blob=img;

             this.db.updateFirma(this.firma).then((res)=>{
               console.log("updatefirma res:",res);
             
              this.clear();
              //this.buscarfirma();
             // this.router.navigate(['/firma']);
             this.router.navigate(['/tabs/servicio']);

             });
             
            }
             
             ,
            err => this.settings.Toast_presentError('Error saving image to gallery '+  err.error)

          );
      //  }
      //   else {
      //     this.requestPermissions();
      //   }
      // }
  //     ,
    // err => this.requestPermissions()
   //);

  }

  // requestPermissions() {
  //   this.androidPermissions.requestPermissions([
  //     this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
  //     this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
  //     .then(
  //       res => {
  //         console.log('Saved image to gallery ', res);
  //         this.save();
  //       },
  //       err => this.settings.Toast_presentError('Error saving image to gallery '+  err.error)
  //     );
  // }

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