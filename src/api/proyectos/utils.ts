import type { AmpliacionFecha, ConfigProyecto } from 'src/pages/proyectos/[id]/index.d';
import { Proyecto } from './useProyectosApi';

export const mapProyectoDatosBasicosToFrontend = (proyecto: any): Proyecto => {
  return {
    id: proyecto.id,
    nombre: proyecto.nombre,
    ubicacion: proyecto.ubicacion,
    presupuestoInicial: proyecto.presupuesto_inicial ?? 0,
    socioAsignado: proyecto.socio_asignado,
    fechaInicio: proyecto.fecha_inicio,
    fechaFin: proyecto.fecha_fin,
  };
};

export const mapProyectoToConfig = (data: {
  nombre: string;
  ubicacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  socioAsignado: string;
  ingresos: any[];
  pagos: any[];
  ampliaciones: AmpliacionFecha[];
  presupuestos: any[];
}): ConfigProyecto => {
  const presupuestoInicialObj = data.presupuestos.find((p) => p.tipo === 'inicial');
  const presupuestoInicial = presupuestoInicialObj?.monto ?? 0;

  const fechaMasReciente = (() => {
    if (data.ampliaciones.length === 0) {
      return data.fecha_fin;
    }

    return data.ampliaciones.reduce((latest, current) =>
      new Date(current.fecha) > new Date(latest.fecha) ? current : latest
    ).fecha;
  })();

  return {
    datosBasicos: {
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      fechaInicio: data.fecha_inicio,
      fechaFin: fechaMasReciente,
      presupuestoInicial,
      socio: { id: data.socioAsignado, nombre: 'Socio asignado' }, // Puedes mejorar esto después
    },
    ingresos: data.ingresos,
    pagos: data.pagos,
    ampliacionesFecha: data.ampliaciones,
    ampliacionesPresupuesto: data.presupuestos
      .filter((p) => p.tipo !== 'inicial')
      .map((p) => ({
        fecha: p.fecha_creacion,
        motivo: p.motivo,
        monto: p.monto,
        usuario: p.usuario_creador,
      })),
    revisiones: [],
    maquinaria: [],
    personal: [],
    materialPlanificado: [],
  };
};
