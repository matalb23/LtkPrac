CREATE TABLE IF NOT EXISTS servicios(
    codigo INTEGER ,
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
    canal TEXT    
);