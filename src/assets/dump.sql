CREATE TABLE IF NOT EXISTS servicios(
    codigo INTEGER primary key ,
    cliente INTEGER , 
    clienteRazonSocial TEXT,
    fechaPedido Datetime,
    buqueNombre TEXT,
    buqueCoeficiente DECIMAL(10,2),
    buqueEslora DECIMAL(10,2),
    buqueManga DECIMAL(10,2),
    buquePuntal DECIMAL(10,2),
    buqueSenial TEXT,
    buqueBandera TEXT,
    practico1 INTEGER,
    practico1Nombre TEXT,
    practico2 INTEGER,
    practico2Nombre TEXT,
    lugarDesde TEXT,
    lugarHasta TEXT,
    lugarKilometros DECIMAL(10,2),
    fechaInicio datetime,
    fechaFin datetime,    
    calado_Proa DECIMAL(10,2),
    calado_Popa DECIMAL(10,2),
    cabotaje bit,
    observacion TEXT,
    taraBruta DECIMAL(10,2),
    taraNeta DECIMAL(10,2),
    canal TEXT,
    propietario text,
    transfirio bit,
    propietarioNombre text,
     FechaInicioNavegacion datetime,
      fechaABordo datetime
);


CREATE TABLE IF NOT EXISTS firmas(
    tipo TEXT primary key,    
    codigo INTEGER ,        
    firmante TEXT,    
    firmaFecha datetime null,    
    firma TEXT null,    
    latitude DECIMAL(9,6) null,
    longitude DECIMAL(9,6) null,
    blob TEXT null,
    orden integer
);

CREATE TABLE IF NOT EXISTS demoras(
    id integer null ,    
    servicio INTEGER ,             
    fecha datetime null,    
    tipo int null,    
    nota text null,
    horasDeDemora DECIMAL(10,2) null, 
    tipoDescripcion text null,
    idInterno INTEGER PRIMARY KEY AutoIncrement,
    transfirio bit
);


CREATE TABLE IF NOT EXISTS maniobras(
    id integer null ,    
    servicio INTEGER ,             
    fecha datetime null,    
    tipo int null,    
    nota text null,
    cantidad DECIMAL(10,2) null,   
    tipoDescripcion text null,
    idInterno INTEGER PRIMARY KEY AutoIncrement,
    transfirio bit
);


CREATE TABLE IF NOT EXISTS tipoManiobra(
    id integer null ,        
    descripcion text null    
);

CREATE TABLE IF NOT EXISTS tipoDemora(
    id integer null ,        
    descripcion text null
);