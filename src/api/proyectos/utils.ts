import type { AmpliacionFecha, ConfigProyecto, Personal } from 'src/pages/proyectos/[id]/index.d';
import { TipoIngreso } from 'src/pages/proyectos/configuracion/tipo-ingresos/index.d';
import { TipoPago } from 'src/pages/proyectos/configuracion/tipo-pagos/index.d';
import { AsignacionMaquinaria, AsignacionPersonal, Proyecto, Revision, Socio, Maquinaria } from '../types';


export const mapProyectoDatosBasicosToFrontend = (proyecto: any): Proyecto => {
  return {
    id: proyecto.id,
    nombre: proyecto.nombre,
    ubicacion: proyecto.ubicacion,
    presupuestoInicial: proyecto.presupuesto_inicial ?? 0,
    socio_asignado: proyecto.socio_asignado,
    fechaInicio: proyecto.fecha_inicio,
    fechaFin: proyecto.fecha_fin
  };
};

export const mapProyectoToConfig = (data: {
  id: number;              
  nombre: string;
  ubicacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  socios: Socio[];
  socio_asignado: any;
  ingresos: any[];
  pagos: any[];
  ampliaciones: AmpliacionFecha[];
  presupuestos: any[];
  tiposIngreso: TipoIngreso[];
  tiposPago: TipoPago[];
  maquinaria: Maquinaria[];
  asignacionesMaquinaria: AsignacionMaquinaria[];
  usuarios: any[];
  asignacionesPersonal: AsignacionPersonal[];
  revisiones: Revision[];
}): ConfigProyecto => {

  const presupuestoInicial = data.presupuestos.find(p => p.tipo === 'inicial')?.monto || 0;
  const presupuestoTotal = data.presupuestos.reduce((total, p) => total + Number(p.monto), 0);


  const fechaMasReciente = (() => {
    if (data.ampliaciones.length === 0) {
      return data.fecha_fin;
    }

    return data.ampliaciones.reduce((latest, current) =>
      new Date(current.fecha) > new Date(latest.fecha) ? current : latest
    ).fecha;
  })();

  const totalIngresos = data.ingresos.reduce((sum, ingreso) => sum + Number(ingreso.monto_total), 0);
  const totalPagos = data.pagos.reduce((sum, pago) => sum + Number(pago.monto_total), 0);

  return {
    datosBasicos: {
      id: data.id,
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      fechaInicio: data.fecha_inicio,
      fechaFin: fechaMasReciente,
      presupuestoInicial,
      socio_asignado: data.socio_asignado,
    },
    presupuestoTotal: presupuestoTotal,
    totalIngresos,
    totalPagos,
    socios: data.socios,
    tiposIngreso: data.tiposIngreso,
    tiposPago: data.tiposPago,
    ingresos: data.ingresos,
    pagos: data.pagos,
    ampliacionesFecha: data.ampliaciones,
    ampliacionesPresupuesto: data.presupuestos,
    maquinaria: data.maquinaria,
    asignacionesMaquinaria: data.asignacionesMaquinaria,
    usuarios: data.usuarios,
    asignacionesPersonal: data.asignacionesPersonal,
    revisiones: data.revisiones,
  };
};
