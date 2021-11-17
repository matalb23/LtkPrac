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
    practico1 TEXT,
    practico1Nombre TEXT,
    practico2 TEXT,
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
    canal TEXT    ,
    propietario text,
    transfirio bit
);


CREATE TABLE IF NOT EXISTS firmas(
   -- id integer primary key AUTOINCREMENT,
    tipo TEXT primary key,    
    codigo INTEGER ,        
    firmante TEXT,    
    firmaFecha datetime null,    
    firma TEXT null,    
    latitude DECIMAL(9,6) null,
    longitude DECIMAL(9,6) null,
    blob BLOB null
);
