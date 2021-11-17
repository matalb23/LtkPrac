import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Servicio } from './servicio';
import { Firma } from './firma';
//import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  serviciosList = new BehaviorSubject([]);
  firmasList = new BehaviorSubject([]);
  Sinfirma: BehaviorSubject<Firma> = new BehaviorSubject(null);
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
        this.create()
        console.log("Elimino:", xx)
      });

  }

  dbState() {

    return this.isDbReady.asObservable();
  }


  fetchServicios(): Observable<Servicio[]> {
    return this.serviciosList.asObservable();
  }
  fetchFirmas(): Observable<Firma[]> {
    return this.firmasList.asObservable();
  }
  fetchSinFirmar(): Observable<Firma> {
    return this.Sinfirma.asObservable();
  }
  /*
    buscarSinfirmar():Promise<Firma>{
      let firma:Firma=null;
      this.dbState().subscribe((res) => {
        if (res) {
          console.log("buscarSinfirmar.dbState res",res)
          this.fetchFirmas().subscribe(item => {          
            //console.log(" fetchFirmasitem",item);
            if(item.length>0)
            {
                for(let i=0;i< item.length;i++)
                {
                    
                    if (item[i].firma == null )             //&& firma==null 
                    { 
                      console.log("value",item[i]);
                      firma= <Firma>item[i];
                      return new Promise(resolve=>{resolve(firma)});
                      break;
                    }
                }
                
            }
            console.log("buscarSinfirmar.item",item);
            return new Promise(resolve=>{resolve(firma)});
          })
          
        }
        // console.log("buscarSinfirmar retorna ",firma);
        // return new Promise(resolve=>{resolve(firma)});
      });
      console.log("buscarSinfirmar retorna firma",firma);
      return new Promise(resolve=>{resolve(firma)});
    }
  */
  buscarSinfirmar(): Promise<Firma> {
    let firma: Firma = null;
    this.dbState().subscribe((res) => {
      if (res) {
        console.log("buscarSinfirmar.dbState res", res)
        this.fetchFirmas().subscribe(item => {
          //console.log(" fetchFirmasitem",item);
          if (item.length > 0) {
            for (let i = 0; i < item.length; i++) {

              if (item[i].firma == null && firma == null)             //
              {
                console.log("value", item[i]);
                firma = <Firma>item[i];
                this.Sinfirma.next(firma)
                break;
              }
            }
            if (firma == null)
              this.Sinfirma.next(firma)

          }

        })
        //return new Promise(resolve=>{resolve(firma)});
      }


    });
    console.log("buscarSinfirmar retorna firma", firma);
    return new Promise(resolve => { resolve(firma) });
  }


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
  getFirmas() {

    return this.storage.executeSql('SELECT * FROM firmas order by tipo asc', []).then(res => {
      let items: Firma[] = [];
      console.log("select RES:", res)
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
      console.log("getFirmas", items)
      this.firmasList.next(items);
      this.buscarSinfirmar();
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
            transfirio: res.rows.item(i).transfirio
          });
        }
        this.getFirmas();

      }

      this.serviciosList.next(items);
    });
  }


  // Add
  addServicio(s: Servicio) {

    //     //28
    let data = [s.codigo, s.cliente, s.clienteRazonSocial, s.fechaPedido, s.buqueNombre, s.buqueCoeficiente, s.buqueEslora, s.buqueManga, s.buquePuntal, s.buqueSenial, s.buqueBandera, s.practico1, s.practico1Nombre, s.practico2, s.practico2Nombre, s.lugarDesde, s.lugarHasta, s.lugarKilometros, s.fechaInicio, s.fechaFin, s.calado_Proa, s.calado_Popa, s.cabotaje, s.observacion, s.taraBruta, s.taraNeta, s.canal, s.propietario, s.transfirio];
    console.log("INSERT data:", data);

    return this.storage.executeSql('INSERT OR REPLACE INTO  servicios (codigo, cliente, clienteRazonSocial, fechaPedido, buqueNombre, buqueCoeficiente, buqueEslora, buqueManga, buquePuntal, buqueSenial, buqueBandera, practico1, practico1Nombre, practico2, practico2Nombre, lugarDesde, lugarHasta, lugarKilometros, fechaInicio, fechaFin, calado_Proa, calado_Popa, cabotaje,observacion,taraBruta,taraNeta,canal,propietario,transfirio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data)
      .then(res => {
        data = [s.codigo, "Master", "Master"];
        this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante) VALUES (?,?,?)', data).then(ri => { console.log("ri", ri) });
        if (s.practico1 > 0) {
          data = [s.codigo, "Practico1", s.practico1Nombre];
          this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante) VALUES (?,?,?)', data);
        }
        if (s.practico2 > 0) {
          data = [s.codigo, "Practico2", s.practico2Nombre];
          this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante) VALUES (?,?,?)', data);
        }
        console.log("ultima firma", data)

        this.getServicios();
        this.getFirmas();

      });

  }

  // // Add
  // updateServicio(s: Servicio) {

  //   //     //23
  //   let data = [s.codigo, s.cliente, s.clienteRazonSocial, s.fechaPedido, s.buqueNombre, s.buqueCoeficiente, s.buqueEslora, s.buqueManga, s.buquePuntal, s.buqueSenial, s.buqueBandera, s.practico1, s.practico1Nombre, s.practico2, s.practico2Nombre, s.lugarDesde, s.lugarHasta, s.lugarKilometros, s.fechaInicio, s.fechaFin, s.calado_Proa, s.calado_Popa, s.cabotaje,s.observacion,s.taraBruta,s.taraNeta,s.canal];
  //   console.log("INSERT data:", data);

  //   return this.storage.executeSql('INSERT OR REPLACE INTO  servicios (codigo, cliente,clienteRazonSocial,fechaPedido,buqueNombre,buqueCoeficiente,buqueEslora,buqueManga,buquePuntal,buqueSenial,buqueBandera,practico1,practico1Nombre,practico2,practico2Nombre,lugarDesde,lugarHasta,lugarKilometros,fechaInicio,fechaFin,calado_Proa,calado_Popa,cabotaje) VALUES (?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?, ?,?,?,?,?)', data)
  //     .then(res => {
  //       data = [s.codigo, "Master", "Master"];
  //       this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante) VALUES (?,?,?)', data).then(ri=>{ console.log("ri",ri)});
  //       data = [s.codigo, "Practico1", s.practico1Nombre];
  //       this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante) VALUES (?,?,?)', data);
  //       data = [s.codigo, "Practico2", s.practico2Nombre];
  //       this.storage.executeSql('INSERT OR REPLACE INTO firmas (codigo, tipo,firmante) VALUES (?,?,?)', data);
  //       console.log("ultima firma", data)

  //       this.getServicios();
  //       this.getFirmas();

  //     });

  // }

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

    // let data = [s.fechaInicio, s.fechaFin, s.calado_Popa, s.calado_Proa, s.cabotaje, s.observacion, s.taraBruta, s.taraNeta, s.canal];
    let data = [s.codigo, s.cliente, s.clienteRazonSocial, s.fechaPedido, s.buqueNombre, s.buqueCoeficiente, s.buqueEslora, s.buqueManga, s.buquePuntal, s.buqueSenial, s.buqueBandera, s.practico1, s.practico1Nombre, s.practico2, s.practico2Nombre, s.lugarDesde, s.lugarHasta, s.lugarKilometros, s.fechaInicio, s.fechaFin, s.calado_Proa, s.calado_Popa, s.cabotaje, s.observacion, s.taraBruta, s.taraNeta, s.canal, s.propietario, s.transfirio];
    let sql: string = "";
    console.log("updateServicio-data  ", s.codigo, data)
    sql += "UPDATE servicios SET codigo=?, ";
    sql += "  cliente=?, clienteRazonSocial=?, fechaPedido=?,  "
    sql += " buqueNombre=?, buqueCoeficiente=?, buqueEslora=?, buqueManga=?, buquePuntal=?, buqueSenial=?, buqueBandera=?,"
    sql += " practico1=?, practico1Nombre=?, practico2=?, practico2Nombre=?, "
    sql += " lugarDesde=?, lugarHasta=?, lugarKilometros=?,"
    sql += " fechaInicio=?, fechaFin=?, calado_Proa=?, calado_Popa=?, cabotaje=?,observacion=?,taraBruta=?,taraNeta=?,canal=?,propietario=?,transfirio=?"
    //sql+=" WHERE codigo = '"+s.codigo+"'"
    // `UPDATE servicios SET fechaInicio = ?, fechaFin = ?,calado_Popa = ?,calado_Proa = ?,cabotaje=?,observacion = ?,taraBruta= ?,taraNeta= ?,canal= ?  WHERE codigo = ${s.codigo}`
    return this.storage.executeSql(sql, data)
      .then(data => {

       
        if (s.firmas != null) {
          s.firmas.forEach(firma => {
            if (firma.firma != null)//con esto se da cuenta que esta firmado
            {
              console.log("updateServicio.s.firmas",s.firmas);
              this.updateFirma(firma);
            }
          });
        }
        console.log("updateServicio.s.getServicios",s.firmas);
        this.getServicios();


      })
  }
  updateFirma(f: Firma) {

    let data = [f.firma, f.firmaFecha, f.latitude, f.longitude, f.blob];
    f.tipo = f.tipo.trim();
    console.log("update " + f.tipo, data);
    return this.storage.executeSql(`UPDATE firmas SET firma = ?, firmaFecha = ?,latitude = ?,longitude = ?,blob=?  WHERE tipo = '${f.tipo}'`, data)
      .then(data => {
        this.getFirmas();
        //  this.buscarSinfirmar();
      })
  }
  updateFirmasLimpiar() {
    return this.storage.executeSql(`UPDATE firmas SET firma = null, firmaFecha = null,latitude = null,longitude = null`)
      .then(data => {
        console.log("updateFirmasLimpiar data:" + data);
        this.getFirmas();
        //this.buscarSinfirmar();


      })
  }
  // deleteServicio(Codigo) {
  //   //DELETE FROM firmas;

  //   this.storage.executeSql(' DELETE FROM firmas WHERE codigo = ?', [Codigo])
  //     .then(xx => {
  //       return this.storage.executeSql(' DELETE FROM servicios WHERE codigo = ?', [Codigo])
  //         .then(_ => {
  //           this.getServicios();
  //         });
  //     });

  // }
  deleteServicios(codigo) {
    // tienen que tener * o una condicion
    return this.storage.executeSql('DELETE FROM servicios WHERE codigo=' + codigo + ';').then(xx => {
      console.log("Limpia firmas");
      this.getServicios();
      return this.storage.executeSql('DELETE FROM firmas WHERE codigo=' + codigo + ';').then(xx => {
        this.getServicios();
        console.log("Limpia servicios");
        this.storage.executeSql('VACUUM;').then(xx => {
          console.log("VAcum");
        });


        //console.log("deleteServicios elimino firmas",xx);

      });

    });


  }
  dropTable() {
  // console.log("drop table firmas y servicios")
    let sql = " "    
    sql += " Drop Table If Exists servicios;";
    // sql += " Drop Table If Exists [dbo].[firmas];";
    
    return this.storage.executeSql(sql)
      .then(_ => {
        console.log("DROP table servicios", _)
        sql += " Drop Table If Exists firmas;";
        return this.storage.executeSql(sql)
        .then(_ => {
          console.log("DROP table firmas", _)
          this.getServicios();
          this.ExecuteInicial()
  
  
        });
        

      });
  }


}