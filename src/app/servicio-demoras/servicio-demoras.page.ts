
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DbService } from '../service/db.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { Demora } from '../service/demora';
@Component({
  selector: 'app-servicio-demoras',
  templateUrl: './servicio-demoras.page.html',
  styleUrls: ['./servicio-demoras.page.scss'],
})
export class ServicioDemorasPage implements OnInit {
  public currentTipo: number;
  
  demoras: any
  mainForm: FormGroup;
  tipos: any;
  fechaTemp;
  selectedtipo: string;
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

  ) { }

  ngOnInit() {
    this.inicializarForm();
    this.db.dbState().subscribe((res) => {

      if (res) {
        this.getTipos();
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
      horasDeDemora: ['']
    })


    this.mainForm.setValue({
      id: 0,
      servicio: this.codigoservicio,
      fecha: '',
      tipo: '',
      nota: '',
      horasDeDemora: ''

    }

    )
  }
  storeData() {
    let demora = <Demora><unknown>this.mainForm.value;
    var tipo = this.selectedtipo.split('-/-');
    demora.fecha = this.fechaTemp.replace("T", " ");
    demora.id = this.db.TransferidoNOValor; //para que se elimine cuando venga de la api
    demora.transfirio = 0;
    demora.tipo = Number(tipo[0]);
    demora.tipoDescripcion = tipo[1];

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


  cargarDatos() {
    this.api.get("api/Demora?login=" + this.settings.getValue(SettingsService.setting_User) + "&Servicio=" + this.codigoservicio).subscribe((data) => {
      console.log("Busca Demora y actualiza bd local:", data)

      this.demoras = data;

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
      this.demoras = res
      console.log("Demoras  bd local:", res)
    })
  }

}
