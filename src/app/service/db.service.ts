import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Servicio } from './servicio';
// import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  serviciosList = new BehaviorSubject([]);//[]
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'LtkPrac.db',
        location: 'default',
        createFromLocation: 1
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.ExecuteInicial();
        });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchServicios(): Observable<Servicio[]> {
    return this.serviciosList.asObservable();
  }

  // Render fake data
  ExecuteInicial() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getServicios();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  getServicios() {
    return this.storage.executeSql('SELECT * FROM servicios', []).then(res => {
      let items: Servicio[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            codigo: res.rows.item(i).codigo,
            cliente: res.rows.item(i).cliente,
            clienteRazonSocial: res.rows.item(i).clienteRazonSocial,
            buqueBandera: res.rows.item(i).buqueBandera,
            buqueCoeficiente: res.rows.item(i).buqueCoeficiente,
            buqueEslora: res.rows.item(i).buqueEslora,
            buqueManga: res.rows.item(i).buqueManga,
            buqueNombre: res.rows.item(i).buqueNombre,
            buquePuntal: res.rows.item(i).buquePuntal,
            buqueSenial: res.rows.item(i).buqueSenial,
            cabotaje: res.rows.item(i).cabotaje,
            calado_Popa: res.rows.item(i).calado_Popa,
            calado_Proa: res.rows.item(i).calado_Proa,
            fechaFin: res.rows.item(i).fechaFin,
            fechaInicio: res.rows.item(i).fechaInicio,
            fechaPedido: res.rows.item(i).fechaPedido,
            lugarDesde: res.rows.item(i).lugarDesde,
            lugarHasta: res.rows.item(i).lugarHasta,
            lugarKilometros: res.rows.item(i).lugarKilometros,
            practico1: res.rows.item(i).practico1,
            practico2: res.rows.item(i).practico2,
            practico1Nombre: res.rows.item(i).practico1Nombre,
            practico2Nombre: res.rows.item(i).practico2Nombre,
            observacion: res.rows.item(i).observacion,
            taraBruta: res.rows.item(i).taraBruta,
            taraNeta: res.rows.item(i).taraNeta,
            canal: res.rows.item(i).canal,
          });
        }
      }

      this.serviciosList.next(items);
    });
  }


  // Add
  addServicio(s: Servicio) {

    //     //23
        let data = [s.codigo, s.cliente, s.clienteRazonSocial, s.fechaPedido, s.buqueNombre, s.buqueCoeficiente, s.buqueEslora, s.buqueManga, s.buquePuntal, s.buqueSenial, s.buqueBandera, s.practico1, s.practico1Nombre, s.practico2, s.practico2Nombre, s.lugarDesde, s.lugarHasta, s.lugarKilometros, s.fechaInicio, s.fechaFin, s.calado_Proa, s.calado_Popa, s.cabotaje];
        console.log("INSERT data:", data);

        return this.storage.executeSql('INSERT INTO servicios (codigo, cliente,clienteRazonSocial,fechaPedido,buqueNombre,buqueCoeficiente,buqueEslora,buqueManga,buquePuntal,buqueSenial,buqueBandera,practico1,practico1Nombre,practico2,practico2Nombre,lugarDesde,lugarHasta,lugarKilometros,fechaInicio,fechaFin,calado_Proa,calado_Popa,cabotaje) VALUES (?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?)', data)
          .then(res => {
            this.getServicios();

          });
 
  }
  existServicio(codigo: number) {

    let b: boolean;
    this.fetchServicios().subscribe(items => {

      if (items.length === 0) {
        b = false

      }
      else {
        if (items[0].codigo == codigo) {
          b = true
        }
        else {
          b = false
        }

      }
    });
    return b;
  }
  update(s: Servicio) {
    let data = [s.fechaInicio, s.fechaFin, s.calado_Popa, s.calado_Proa,s.cabotaje,s.observacion,s.taraBruta,s.taraNeta,s.canal];
    console.log("updatesong_data", data);

    return this.storage.executeSql(`UPDATE servicios SET fechaInicio = ?, fechaFin = ?,calado_Popa = ?,calado_Proa = ?,cabotaje=?,observacion = ?,taraBruta= ?,taraNeta= ?,canal= ?  WHERE codigo = ${s.codigo}`, data)
      .then(data => {
        this.getServicios();
      })
  }

  // Delete



  deleteServicio(Codigo) {
    return this.storage.executeSql('DELETE FROM servicios WHERE id = ?', [Codigo])
      .then(_ => {
        this.getServicios();
      });
  }
  deleteServicios() {
    console.log("delete servicios")
    return this.storage.executeSql('DELETE FROM  servicios ')
      .then(_ => {
        this.getServicios();
      });
  }
  dropTable() {
    console.log("drop servicios")
    return this.storage.executeSql('DROP TABLE servicios ')
      .then(_ => {
        this.getServicios();
      });
  }
}