export const mapIngresoToFrontend = (ingreso: any) => ({
  id_ingreso: ingreso.id,
  proyecto_id: ingreso.proyecto,
  monto_total: Number(ingreso.monto_total),
  fecha_ingreso: ingreso.fecha_creacion,
  tipo_ingreso: ingreso.tipo_ingreso,
  tipo_documento: ingreso.tipo_documento,
  anotaciones: ingreso.anotaciones,
  usuario_registro: ingreso.usuario_creador,
});
