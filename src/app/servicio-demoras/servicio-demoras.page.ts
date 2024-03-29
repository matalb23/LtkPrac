
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DbService } from '../service/db.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { Demora } from '../service/demora';

import { AlertController } from '@ionic/angular';
import { Practico } from '../service/practico';

@Component({
  selector: 'app-servicio-demoras',
  templateUrl: './servicio-demoras.page.html',
  styleUrls: ['./servicio-demoras.page.scss'],
})
export class ServicioDemorasPage implements OnInit {
  public currentTipo: number;
  public currentPractico: number;
  
  //demoras: any
  demoras:Demora[];
  mainForm: FormGroup;
  tipos: any;
  practicos: any;
  fechaTemp;
  selectedtipo: string;
  selectedPractico:string;
  mensajeSinDemora: string

  @Input() codigoservicio: string;
  constructor(private modalCtr: ModalController,
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private settings: SettingsService,
    private api: ApiService,
    public modalCtrl: ModalController,
    public alertController: AlertController

  ) { }

  ngOnInit() {
    this.inicializarForm();
    this.db.dbState().subscribe((res) => {

      if (res) {
        this.getTipos();
        this.getPracticosAfectado();
      }
    });

  }
  async close() {
    const closeModal: string = "Demoras Cargadas:" + this.demoras.length;
    await this.modalCtr.dismiss(closeModal);
  }
  inicializarForm() {
    this.mainForm = this.formBuilder.group({
      id: [''],
      servicio: [''],
      fecha: [''],
      tipo: [''],
      nota: [''],
      horasDeDemora: [''],
      practicoAfectado: ['']
    })


    this.mainForm.setValue({
      id: 0,
      servicio: this.codigoservicio,
      fecha: '',
      tipo: '',
      nota: '',
      horasDeDemora: '',
      practicoAfectado: ''
    }

    )
  }
  storeData() {
    let demora = <Demora><unknown>this.mainForm.value;
    var tipo = this.selectedtipo.split('-/-');
    var practicoAfectado = this.selectedPractico.split('-/-');
    demora.fecha = this.fechaTemp.replace("T", " ");
    demora.id = this.db.TransferidoNOValor; //para que se elimine cuando venga de la api
    demora.transfirio = 0;
    demora.tipo = Number(tipo[0]);
    demora.tipoDescripcion = tipo[1];
    demora.practicoAfectado = Number(practicoAfectado[0]);
    this.db.addDemora(demora)
      .then((res) => {
        console.log("demora luedo de graba", demora)
        this.api.post2('api/demora', demora).subscribe((result) => {
          var respuesta = JSON.parse(JSON.stringify(result));
          this.db.demoraTransferido(demora.idInterno).then(res => {
          })
        });
      })
      .catch(e => {
        console.log("error this.db.addDemora", e);
      });


    console.log("this.mainForm.value", this.mainForm.value);
    this.limpiarForm()
  }
  limpiarForm() {
    this.mainForm.reset();
    Object.keys(this.mainForm.controls).forEach(key => {
      this.mainForm.get(key).setErrors(null);
    });
    this.fechaTemp = null;
    this.inicializarForm();
  }
  getTipos() {
    this.db.fetchTipoDemora().subscribe(res => {
      this.tipos = res;
      console.log("fetchTipoDemora  bd local:", res)
    })    
  }
  getPracticosAfectado() {
    this.db.fetchPractico().subscribe(res => {
      this.practicos = res;
      // let pAmbos= new Practico
      // pAmbos.id=3//1=practico1;2=Practico2; 3 Ambos
      // pAmbos.nombre="AMBOS"      
      // this.practicos.push(pAmbos);
      console.log("getPracticosAfectado  bd local:", res)
    })    
  }
  selectChangedPractico(practico) {
    this.selectedPractico = practico;
    console.log("selectChangedPractico:" + practico);

  };
  selectChanged(tipo) {
    this.selectedtipo = tipo;
    console.log("selectedgrupo:" + tipo);

  };

  ionViewDidEnter() {
    this.fechaTemp = null;

    this.db.dbState().subscribe((res) => {
      if (res) {
        this.cargarDatos();
      }
    });

  }
  async eliminar(id,idInterno){//idInterno
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirme!',
      message: '<strong>¿Esta seguro de eliminar la demora?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
           //codigo en el cancel
          }
        }, {
          text: 'Eliminar',
          id: 'confirm-button',
          handler: () => {
          //codigo en el ok
          this.db.demoraBajaLogica(id,idInterno).then(res=>{});
          }
        }
      ]
    });

    await alert.present();
   
  }


  cargarDatos() {
    this.api.get("api/Demora?login=" + this.settings.getValue(SettingsService.setting_User) + "&Servicio=" + this.codigoservicio).subscribe((data) => {
      console.log("Busca Demora y actualiza bd local:", data)

      this.demoras =  <Demora[]><unknown>data;

      if (data !== null) {//tengo que actualizar         

        this.db.deleteAllDemoraIdNoCero().then(res => {
          for (let demora of this.demoras) {
            demora.transfirio = this.db.TransferidoValor;//son de la api
            this.db.addDemora(demora).then(res => { })
              .catch(e => {
                console.log("error this.db.addDemora", e);
              })
              .catch(e => {
                console.log("error this.db.deleteAllDemoraIdNoCero", e);
              });
          }
        })//elimino previante los ue vinieon de la api y los vuelvo a poner


      }
    });
    this.db.fetchDemoras().subscribe(res => {
      this.demoras =[];
      if (res.length) {
        res.forEach(demora => {
          if (demora.eliminado == 0) {
          this.demoras.push(demora);
          }
        })
      }
    //  this.demoras = res
      console.log("Demoras  bd local:", res)
    })
  }

}
