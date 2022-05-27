
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DbService } from '../service/db.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";
import { SettingsService } from '../service/settings.service';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { Maniobra } from '../service/maniobra';

@Component({
  selector: 'app-servicio-maniobras',
  templateUrl: './servicio-maniobras.page.html',
  styleUrls: ['./servicio-maniobras.page.scss'],
})
export class ServicioManiobrasPage implements OnInit {

  public currentTipo: number;
  
  maniobras: any
  mainForm: FormGroup;
  tipos: any;
  fechaTemp;
  selectedtipo: string;
  mensajeSinManiobra: string

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
    const closeModal: string = "Maniobras Cargadas:" + this.maniobras.length;
    await this.modalCtr.dismiss(closeModal);
  }
  inicializarForm() {
    this.mainForm = this.formBuilder.group({
      id: [''],
      servicio: [''],
      fecha: [''],
      tipo: [''],
      nota: [''],
      cantidad: ['']
    })


    this.mainForm.setValue({
      id: 0,
      servicio: this.codigoservicio,
      fecha: '',
      tipo: '',
      nota: '',
      cantidad: ''

    }

    )
  }
  storeData() {
    let maniobra = <Maniobra><unknown>this.mainForm.value;
    var tipo = this.selectedtipo.split('-/-');
    maniobra.fecha = this.fechaTemp.replace("T", " ");
    maniobra.id = this.db.TransferidoNOValor; //para que se elimine cuando venga de la api
    maniobra.transfirio = 0;
    maniobra.tipo = Number(tipo[0]);
    maniobra.tipoDescripcion = tipo[1];

    this.db.addManiobra(maniobra)
      .then((res) => {
        console.log("maniobra luedo de graba", maniobra)
        this.api.post2('api/maniobra', maniobra).subscribe((result) => {
          var respuesta = JSON.parse(JSON.stringify(result));
          this.db.maniobraTransferido(maniobra.idInterno).then(res => {
          })
        });
      })
      .catch(e => {
        console.log("error this.db.addManiobra", e);
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
    this.db.fetchTipoManiobra().subscribe(res => {
      this.tipos = res;
      console.log("fetchTipoManiobra  bd local:", res)
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
    this.api.get("api/Maniobra?login=" + this.settings.getValue(SettingsService.setting_User) + "&Servicio=" + this.codigoservicio).subscribe((data) => {
      console.log("Busca Maniobra y actualiza bd local:", data)

      this.maniobras = data;

      if (data !== null) {//tengo que actualizar         

        this.db.deleteAllManiobraIdNoCero().then(res => {
          for (let maniobra of this.maniobras) {
            maniobra.transfirio = this.db.TransferidoValor;//son de la api
            this.db.addManiobra(maniobra).then(res => { })
              .catch(e => {
                console.log("error this.db.addManiobra", e);
              })
              .catch(e => {
                console.log("error this.db.deleteAllManiobraIdNoCero", e);
              });
          }
        })//elimino previante los ue vinieon de la api y los vuelvo a poner


      }
    });
    this.db.fetchManiobras().subscribe(res => {
      this.maniobras = res
      console.log("Maniobras  bd local:", res)
    })
  }

}
