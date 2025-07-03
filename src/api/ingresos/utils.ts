export const mapIngresoToFrontend = (ingreso: any) => ({
  id_ingreso: ingreso.id,
  proyecto_id: ingreso.proyecto,
  monto_total: ingreso.monto,
  fecha_ingreso: ingreso.fecha,
  tipo_ingreso: ingreso.tipo,
  tipo_documento: ingreso.tipo_documento,
  anotaciones: ingreso.anotaciones,
  usuario_registro: ingreso.usuario_creador_nombre,
});
