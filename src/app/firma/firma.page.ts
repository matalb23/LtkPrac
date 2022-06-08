import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit, Input } from '@angular/core';
import SignaturePad from 'signature_pad';
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
  firma: Firma = null;
  signaturePad: any;
  canvasWidth: number;
  canvasHeight: number;

  firmanteTipo: string;
  constructor(private elementRef: ElementRef,
    private db: DbService,
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
  ionViewDidEnter() {
    this.buscarfirma();
  }
  buscarfirma() {
    this.db.fetchFirmas().subscribe(res => {
      res.forEach(firma => {
        console.log("firmanteTipo",this.firmanteTipo)
        if (firma.tipo == this.firmanteTipo) {
          this.firma = firma
        }
      });

    })

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

    const img = this.signaturePad.toDataURL();
    console.log("img", img)

    this.firma.firma = this.firma.codigo + "_T" + this.firma.tipo + ".png"//nuevo

    this.firma.firmaFecha = new Date().toLocaleString();//new Date();
    this.firma.latitude = 0;
    this.firma.longitude = 0;
    this.firma.blob = img.substring(22)

    this.db.updateFirma(this.firma).then((res) => {
      console.log("updatefirma res:", res);

      this.clear();

      this.router.navigate(['/tabs/servicio']);

    });
   
  }


  dataURItoBlob(dataURI) {

    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
  isCanvasBlank(): boolean {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }

  clear() {
    //this.firma = null;
    this.signaturePad.clear();    
    this.router.navigate(['/firma', { firmanteTipo: this.firmanteTipo }]);
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }
}