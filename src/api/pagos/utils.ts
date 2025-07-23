export const mapPagoToFrontend = (pago: any) => ({
  id_pago: pago.id,
  proyecto_id: pago.proyecto,
  monto_total: pago.monto_total,
  fecha_pago: pago.fecha_pago,
  tipo_pago: pago.tipo_pago,
  tipo_documento: pago.tipo_documento,
  anotaciones: pago.anotaciones,
  correlativo: pago.correlativo,
  usuario_registro: pago.usuario_creador,
});