export const mapPagoToFrontend = (pago: any) => ({
  id_pago: pago.id,
  proyecto_id: pago.proyecto,
  monto_total: pago.monto,
  fecha_pago: pago.fecha,
  tipo_pago: pago.tipo,
  tipo_documento: pago.tipo_documento,
  anotaciones: pago.anotaciones,
  usuario_registro: pago.usuario_creador,
});