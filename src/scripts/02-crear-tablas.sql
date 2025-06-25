-- Crear la tabla instrumento
-- Ejecutar este script conectado a la base de datos InstrumentosDB

CREATE TABLE IF NOT EXISTS instrumento (
    id SERIAL PRIMARY KEY,
    instrumento VARCHAR(255) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) DEFAULT '',
    precio VARCHAR(20) NOT NULL,
    costoEnvio VARCHAR(10) DEFAULT '0',
    cantidadVendida VARCHAR(10) DEFAULT '0',
    descripcion TEXT DEFAULT ''
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_instrumento_marca ON instrumento(marca);
CREATE INDEX IF NOT EXISTS idx_instrumento_precio ON instrumento(precio);

COMMENT ON TABLE instrumento IS 'Tabla que almacena la información de los instrumentos musicales';
COMMENT ON COLUMN instrumento.id IS 'Identificador único del instrumento';
COMMENT ON COLUMN instrumento.instrumento IS 'Nombre del instrumento';
COMMENT ON COLUMN instrumento.marca IS 'Marca del instrumento';
COMMENT ON COLUMN instrumento.modelo IS 'Modelo del instrumento';
COMMENT ON COLUMN instrumento.imagen IS 'Nombre del archivo de imagen';
COMMENT ON COLUMN instrumento.precio IS 'Precio del instrumento';
COMMENT ON COLUMN instrumento.costoEnvio IS 'Costo de envío (G para gratis)';
COMMENT ON COLUMN instrumento.cantidadVendida IS 'Cantidad de unidades vendidas';
COMMENT ON COLUMN instrumento.descripcion IS 'Descripción detallada del instrumento';
