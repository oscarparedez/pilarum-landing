import { AmpliacionFecha } from "src/api/types";


export const mapAmpliacionToFrontend = (ampliacion: any): AmpliacionFecha => {
  return {
    id: ampliacion.id,
    fecha: ampliacion.nueva_fecha_estimada_fin,
    motivo: ampliacion.motivo,
    usuario: ampliacion.usuario_creador,
  };
};
