import { AsignacionMaquinaria, AsignacionPersonal, Proyecto, Revision, Socio, Maquinaria, InventarioConfig, AmpliacionFecha, ConfigProyecto, TipoIngreso, TipoCosto } from 'src/api/types';


export const mapProyectoDatosBasicosToFrontend = (proyecto: any): Proyecto => {
  return {
    id: proyecto.id,
    nombre: proyecto.nombre,
    ubicacion: proyecto.ubicacion,
    identificador: proyecto.identificador ?? '',
    presupuestoInicial: proyecto.presupuesto_inicial ?? 0,
    socio_asignado: proyecto.socio_asignado,
    fechaInicio: proyecto.fecha_inicio,
    fechaFin: proyecto.fecha_fin,
    estado: proyecto.estado || 'pendiente'
  };
};

export const mapProyectoToConfig = (data: {
  id: number;              
  nombre: string;
  ubicacion: string;
  identificador: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'pendiente' | 'en_progreso' | 'pausado' | 'completado' | 'archivado';
  socios: Socio[];
  socio_asignado: any;
  ingresos: any[];
  pagos: any[];
  ampliaciones: AmpliacionFecha[];
  presupuestos: any[];
  tiposIngreso: TipoIngreso[];
  tiposPago: TipoCosto[];
  maquinaria: Maquinaria[];
  asignacionesMaquinaria: AsignacionMaquinaria[];
  usuarios: any[];
  asignacionesPersonal: AsignacionPersonal[];
  materialPlanificado: InventarioConfig;
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
      identificador: data.identificador,
      fechaInicio: data.fecha_inicio,
      fechaFin: fechaMasReciente,
      presupuestoInicial,
      socio_asignado: data.socio_asignado,
      estado: data.estado || 'pendiente',
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
    materialPlanificado: data.materialPlanificado,
    revisiones: data.revisiones,
  };
};
