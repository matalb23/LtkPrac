import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Servicio } from './servicio';
import { Maniobra } from './maniobra';
import { tipoDemora } from './tipoDemora';
import { tipoManiobra } from './tipoManiobra';
import { Demora } from './demora';
import { Firma } from './firma';
import { SettingsService } from '../service/settings.service';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  public TransferidoValor: number = 1;
  public TransferidoNOValor: number = -1;
  private storage: SQLiteObject;
  serviciosList = new BehaviorSubject([]);
  demorasList = new BehaviorSubject([]);
  maniobrasList = new BehaviorSubject([]);
  tipoDemoraList = new BehaviorSubject([]);
  tipoManiobraList = new BehaviorSubject([]);
  firmasList = new BehaviorSubject([]);
    private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  configDatabase = {
    name: 'LtkPrac.db',
    location: 'default',
    createFromLocation: 1
  };
  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private settings: SettingsService,
  ) {
    this.platform.ready().then(() => {
      this.create();
    });
  }
  create() {
    this.sqlite.create(
      this.configDatabase

    )
      .then((db: SQLiteObject) => {
        this.storage = db;
        this.ExecuteInicial();
      });
  }
  deleteDatabase() {
    this.sqlite.deleteDatabase(
      this.configDatabase

    )
      .then(xx => {
        console.log("deleteDatabase-Create bd")
        this.create()
      });

  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchServicios(): Observable<Servicio[]> {

    return this.serviciosList.asObservable();
  }
  fetchDemoras(): Observable<Demora[]> {

    return this.demorasList.asObservable();
  }
  fetchManiobras(): Observable<Maniobra[]> {
    return this.maniobrasList.asObservable();
  }

  fetchTipoDemora(): Observable<tipoDemora[]> {
    return this.tipoDemoraList.asObservable();
  }
  fetchTipoManiobra(): Observable<tipoManiobra[]> {
    return this.tipoManiobraList.asObservable();
  }

  fetchFirmas(): Observable<Firma[]> {
    return this.firmasList.asObservable();
  }
  

  ExecuteInicial() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getServicios().then(res => { });;
          this.getTipoDemora().then(res => { });;
          this.getTipoManiobra().then(res => { });;
          this.getDemoras().then(res => { });;
          this.getManiobras().then(res => { });;
          this.getFirmas().then(res => { });;
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }
  getFirmas() {

    return this.storage.executeSql('SELECT * FROM firmas order by orden asc', []).then(res => {
      let items: Firma[] = [];

      if (res != null) {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({

              codigo: res.rows.item(i).codigo,
              tipo: res.rows.item(i).tipo,
              firmante: res.rows.item(i).firmante,
              firmaFecha: res.rows.item(i).firmaFecha,
              firma: res.rows.item(i).firma,
              latitude: res.rows.item(i).latitude,
              longitude: res.rows.item(i).longitude,
              blob: res.rows.item(i).blob
            });
          }
        }
      }

      this.firmasList.next(items);
    
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
            propietario: res.rows.item(i).propietario,
            transfirio: res.rows.item(i).transfirio,
            propietarioNombre: res.rows.item(i).propietarioNombre,
            fechaInicioNavegacion: res.rows.item(i).FechaInicioNavegacion,
            fechaABordo: res.rows.item(i).fechaABordo,
          });
        }
      }
    
      this.serviciosList.next(items);
    });
  }
  getDemoras() {
    //where eliminado=0
    return this.storage.executeSql('SELECT * FROM demoras ', []).then(res => {
      let items: Demora[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            fecha: res.rows.item(i).fecha,
            horasDeDemora: res.rows.item(i).horasDeDemora,
            id: res.rows.item(i).id,
            servicio: res.rows.item(i).servicio,
            nota: res.rows.item(i).nota,
            tipo: res.rows.item(i).tipo,
            tipoDescripcion: res.rows.item(i).tipoDescripcion,
            idInterno: res.rows.item(i).idInterno,
            transfirio: res.rows.item(i).transfirio,
            eliminado: res.rows.item(i).eliminado
          });
        }
      }
      this.demorasList.next(items);
    });
  }
  getManiobras() {
    //where eliminado=0
    return this.storage.executeSql('SELECT * FROM maniobras ', []).then(res => {
      let items: Maniobra[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            fecha: res.rows.item(i).fecha,
            cantidad: res.rows.item(i).cantidad,
            id: res.rows.item(i).id,
            servicio: res.rows.item(i).servicio,
            nota: res.rows.item(i).nota,
            tipo: res.rows.item(i).tipo,
            tipoDescripcion: res.rows.item(i).tipoDescripcion,
            idInterno: res.rows.item(i).idInterno,
            transfirio: res.rows.item(i).transfirio,
            eliminado: res.rows.item(i).eliminado
          });
        }
     
      }
      this.maniobrasList.next(items);
    });
  }

  getTipoManiobra() {

    return this.storage.executeSql('SELECT * FROM tipoManiobra', []).then(res => {
      console.log("select tipomaniobra", res)
      let items: tipoManiobra[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            descripcion: res.rows.item(i).descripcion
          });
        }
      }
      this.tipoManiobraList.next(items);
    });
  }
  getTipoDemora() {
    return this.storage.executeSql('SELECT * FROM tipoDemora', []).then(res => {
      let items: tipoDemora[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            descripcion: res.rows.item(i).descripcion
          });
        }
      }
      this.tipoDemoraList.next(items);
    });
  }
  addTipoDemora(s: tipoDemora) {

    let data = [s.id, s.descripcion];//,s.idInterno
    console.log("addTipoDemora", data)
    return this.storage.executeSql('INSERT OR REPLACE INTO  tipoDemora (id,descripcion) VALUES (?,?)', data)
      .then(res => {
        console.log("addTipoDemora SUCCESS s:", s)
        this.getTipoDemora().then(res => { });
        //return s;
      });

  }

  addTipoManiobra(s: tipoManiobra) {

    let data = [s.id, s.descripcion];//,s.idInterno
    console.log("addTipoManiobra", data)
    return this.storage.executeSql('INSERT OR REPLACE INTO  tipoManiobra (id,descripcion) VALUES (?,?)', data)
      .then(res => {
        console.log("addTipoManiobra SUCCESS s:", s)
        this.getTipoManiobra().then(res => { });
        // return s;
      });

  }
  deleteDemoras() {

    return this.storage.executeSql("DELETE FROM demoras;", [])
      .then(xx => {
        console.log("DELETE FROM demoras", xx)
        this.getDemoras();
      }).catch(e => {
        console.log("error deleteAlldemoras", e);
      });;

  }
  deleteManiobras() {

    return this.storage.executeSql("DELETE FROM maniobras;", [])
      .then(xx => {
        console.log("DELETE FROM maniobras", xx)
        this.getManiobras();
      }).catch(e => {
        console.log("error deleteAllManiobras", e);
      });;

  }


  deleteAllTipoDemora() {

    return this.storage.executeSql("DELETE FROM tipoDemora;", [])
      .then(xx => {
        console.log("DELETE FROM tipoDemora", xx)
        this.getTipoDemora();
      }).catch(e => {
        console.log("error deleteAllTipoDemora", e);
      });;

  }
  deleteAllTipoManiobra() {

    return this.storage.executeSql("DELETE FROM tipoManiobra;", [])
      .then(xx => {
        console.log("DELETE FROM tipoManiobra", xx)
        this.getTipoManiobra();
      }).catch(e => {
        console.log("errordeleteAllTipoManiobra", e);
      });;

  }

  addDemora(s: Demora) {

    let data = [s.id, s.servicio, s.fecha, s.tipo, s.nota, s.horasDeDemora, s.tipoDescripcion, s.transfirio,0];//eliminado=0
    console.log("addDemora", data)
    return this.storage.executeSql('INSERT OR REPLACE INTO  demoras (Id,Servicio,Fecha,Tipo,Nota,HorasDeDemora,tipoDescripcion,transfirio,eliminado) VALUES (?,?,?,?,?,?,?,?,?)', data)
      .then(res => {
        this.storage.executeSql('select last_insert_rowid() as id', []).then(res => {
          s.idInterno = res.rows.item(0).id;
        })
  

        console.log("addDemora SUCCESS s:", s)
        this.getDemoras().then(res => { });
        return s;
      });

  }

  addManiobra(s: Maniobra) {
    s.transfirio = 0;
    let data = [s.id, s.servicio, s.fecha, s.tipo, s.nota, s.cantidad, s.tipoDescripcion, s.transfirio,0];//eliminado=0
    console.log("addManiobra", data)
    return this.storage.executeSql('INSERT OR REPLACE INTO  maniobras (id,servicio,fecha,tipo,nota,cantidad,tipoDescripcion,transfirio,eliminado) VALUES (?,?,?,?,?,?,?,?,?)', data)
      .then(res => {
        this.storage.executeSql('select last_insert_rowid() as id', []).then(res => {
          s.idInterno = res.rows.item(0).id;
        })
        
        console.log("addManiobra SUCCESS")
        this.getManiobras().then(res => { });
      });
  }

  demoraTransferido(codigo: number) {

    let sql: string = "";
    sql += "UPDATE demoras SET transfirio='1',id=" + this.TransferidoValor.toString() + " where idInterno=" + codigo.toString();

    return this.storage.executeSql(sql, []).then(data => {
       console.log("demoraTransferido",sql)
      return this.getDemoras().then((res) => {

      })
    })
  }
  maniobraTransferido(codigo: number) {

    let sql: string = "";
    sql += "UPDATE maniobras SET transfirio='1',id=" + this.TransferidoValor.toString() + " where idInterno=" + codigo.toString();

    return this.storage.executeSql(sql, []).then(data => {
      console.log("demoraTransferido",sql)
      return this.getManiobras().then((res) => {

      })
    })
  }



  // Add
  addServicio(s: Servicio) {
   // this.deleteServicio();;
    s.transfirio = 0;
    //     //28
    let data = [s.codigo, s.cliente, s.clienteRazonSocial, s.fechaPedido, s.buqueNombre, s.buqueCoeficiente, s.buqueEslora, s.buqueManga, s.buquePuntal, s.buqueSenial, s.buqueBandera, s.practico1, s.practico1Nombre, s.practico2, s.practico2Nombre, s.lugarDesde, s.lugarHasta, s.lugarKilometros, s.fechaInicio, s.fechaFin, s.calado_Proa, s.calado_Popa, s.cabotaje, s.observacion, s.taraBruta, s.taraNeta, s.canal, s.propietario, s.transfirio, s.propietarioNombre,s.fechaInicioNavegacion,s.fechaABordo];
    console.log("addServicio")
    return this.storage.executeSql('INSERT OR REPLACE INTO  servicios (codigo, cliente, clienteRazonSocial, fechaPedido, buqueNombre, buqueCoeficiente, buqueEslora, buqueManga, buquePuntal, buqueSenial, buqueBandera, practico1, practico1Nombre, practico2, practico2Nombre, lugarDesde, lugarHasta, lugarKilometros, fechaInicio, fechaFin, calado_Proa, calado_Popa, cabotaje,observacion,taraBruta,taraNeta,canal,propietario,transfirio,propietarioNombre,FechaInicioNavegacion,fechaABordo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data)
      .then(res => {
        console.log("addServicio SUCCESS")

        if (s.practico1 > 0) {
          data = [s.codigo, "Practico1", s.practico1Nombre, 1];
          this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante,orden) VALUES (?,?,?,?)', data);
        }
        if (s.practico2 > 0) {
          data = [s.codigo, "Practico2", s.practico2Nombre, 2];
          this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante,orden) VALUES (?,?,?,?)', data);
        }
        data = [s.codigo, "Master", "Master", 3];
        this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante,orden) VALUES (?,?,?,?)', data).then(ri => { console.log("ri", ri) });

        this.getServicios().then(res => { });;
        this.getFirmas().then(res => { });;

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
  updateServicio(s: Servicio) {
console.log("updateServicio",s);
    let data = [s.codigo, s.cliente, s.clienteRazonSocial, s.fechaPedido, s.buqueNombre, s.buqueCoeficiente, s.buqueEslora, s.buqueManga, s.buquePuntal, s.buqueSenial, s.buqueBandera, s.practico1, s.practico1Nombre, s.practico2, s.practico2Nombre, s.lugarDesde, s.lugarHasta, s.lugarKilometros, s.fechaInicio, s.fechaFin, s.calado_Proa, s.calado_Popa, s.cabotaje, s.observacion, s.taraBruta, s.taraNeta, s.canal, s.propietario, s.transfirio, s.propietarioNombre,s.fechaInicioNavegacion,s.fechaABordo];
    let sql: string = "";
    sql += "UPDATE servicios SET codigo=?, ";
    sql += "  cliente=?, clienteRazonSocial=?, fechaPedido=?,  "
    sql += " buqueNombre=?, buqueCoeficiente=?, buqueEslora=?, buqueManga=?, buquePuntal=?, buqueSenial=?, buqueBandera=?,"
    sql += " practico1=?, practico1Nombre=?, practico2=?, practico2Nombre=?, "
    sql += " lugarDesde=?, lugarHasta=?, lugarKilometros=?,"
    sql += " fechaInicio=?, fechaFin=?, calado_Proa=?, calado_Popa=?, cabotaje=?,observacion=?,taraBruta=?,taraNeta=?,canal=?,propietario=?,transfirio=?,propietarioNombre=?,FechaInicioNavegacion=?,fechaABordo=?"

    return this.storage.executeSql(sql, data)
      .then(data => {

        //console.log("Actualiza servicio",data)
        if (s.firmas != null) {
          s.firmas.forEach(firma => {
            if (firma.firma != null)//con esto se da cuenta que esta firmado
            {
              this.updateFirma(firma).then(res => { });;
            }
          });
        }
        this.getServicios().then(res => { });;


      })
  }

  servicioTransferido(s: Servicio) {

    let sql: string = "";
    sql += "UPDATE servicios SET transfirio='1' "
    s.transfirio=1;
    return this.storage.executeSql(sql,[]).then(data => {
      
       this.getServicios().then((res) => {
      })
    })
  }

  updateFirma(f: Firma) {

    let data = [f.firma, f.firmaFecha, f.latitude, f.longitude, f.blob];
    f.tipo = f.tipo.trim();

    return this.storage.executeSql(`UPDATE firmas SET firma = ?, firmaFecha = ?,latitude = ?,longitude = ?,blob=?  WHERE tipo = '${f.tipo}'`, data)
      .then(data => {
        console.log("actualiza firmas", f)
        this.getFirmas().then(res => { });
        //  this.buscarSinfirmar();
      })
  }
  
  demoraBajaLogica(id,idInterno) {//si no transfirio eliminino , sino actualizo
    console.log("update demoras",id,idInterno)
    return this.storage.executeSql(`UPDATE demoras SET eliminado = 1,transfirio=0  WHERE idInterno = '${idInterno}'`, [])
      .then(data => {        
        this.getDemoras().then(res => { });        
      })
    // if (id == this.TransferidoNOValor) {
      
    // }
    // else
    // {
    //   console.log("delete demoras",id,idInterno)
    //   return this.storage.executeSql(`DELETE FROM demoras WHERE idInterno = '${idInterno}'`, [])
    //   .then(data => {        

    //     this.getDemoras().then(res => { });        
    //   })

    // }
  }
  maniobraBajaLogica(id,idInterno) {//si no transfirio eliminino , sino actualizo
    console.log("update maniobra",id,idInterno)
    return this.storage.executeSql(`UPDATE maniobras SET eliminado = 1,transfirio=0   WHERE idInterno = '${idInterno}'`, [])
      .then(data => {        
        this.getManiobras().then(res => { });        
      })
    // if (id == this.TransferidoNOValor) {
 
    // }
    // else
    // { 
    //   return this.storage.executeSql(`DELETE FROM maniobras WHERE idInterno = '${idInterno}'`, [])
    //   .then(data => {        
    //     console.log("delete maniobra",id,idInterno)
    //     this.getManiobras().then(res => { });        
    //   })

    // }
  }

  updateFirmasLimpiar() {
    return this.storage.executeSql(`UPDATE firmas SET firma = null, firmaFecha = null,latitude = null,longitude = null`,[])
      .then(data => {
        console.log("Actualiza firma", data)
        this.getFirmas().then(res => { });;
        //this.buscarSinfirmar();


      })
  }
  deleteServicio() {
    //DELETE FROM firmas;

    return this.storage.executeSql(' DELETE FROM firmas;', [])
      .then(xx => {
        
        this.getFirmas().then(res => { });;
        console.log("elimino firmas", xx)
        return  this.storage.executeSql(' DELETE FROM servicios;', [])
          .then(xxx => {
            this.deleteDemoras();
            this.deleteManiobras();
            
            console.log("Limpio, firmas, servicios, demoras, maniobras ", xxx)
            this.getServicios();
          }).catch(e => {
            console.log("error delete servicios", e);
          });;
      }).catch(e => {
        console.log("error delete firmas", e);
      });;

  }


  deleteAllDemoraIdNoCero() {

    return this.storage.executeSql("DELETE FROM demoras where id>" + this.TransferidoNOValor + ";", [])//vienen de la api
      .then(xx => {
        console.log("xx", xx)
        this.getDemoras();
      }).catch(e => {
        console.log("error delete demoras", e);
      });;

  }
  deleteAllManiobraIdNoCero() {

    return this.storage.executeSql("DELETE FROM maniobras where id>" + this.TransferidoNOValor + ";", [])//vienen de la api
      .then(xx => {
        console.log("xx", xx)
        this.getManiobras();
      }).catch(e => {
        console.log("error delete maniobras", e);
      });;

  }
  

}