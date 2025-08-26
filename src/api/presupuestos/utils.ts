import { AmpliacionPresupuesto } from "src/api/types";

export const mapPresupuestoToFrontend = (data: any): AmpliacionPresupuesto => ({
  id: data.id,
  tipo: data.tipo,
  monto: Number(data.monto),
  motivo: data.motivo ?? '',
  fecha: data.fecha_creacion,
  usuario: data.usuario_creador,
});
