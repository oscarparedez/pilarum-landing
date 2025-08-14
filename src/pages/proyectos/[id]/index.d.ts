import { Usuario } from "src/api/planilla/usePlanillaApi/index.d";
import { TipoIngreso } from "../configuracion/tipo-ingresos/index.d";
import { TipoPago } from "../configuracion/tipo-pagos/index.d";
import { AsignacionPersonal, Revision, Socio } from "src/api/types";
import { AsignacionMaquinaria } from "src/api/asignacionesMaquinaria/useAsignacionesMaquinaria";

export interface Costo {
  id_pago: number;
  proyecto_id: string;
  monto_total: number;
  fecha_pago: string;
  tipo_pago: TipoPago;
  tipo_documento: string;
  anotaciones?: string;
  correlativo?: string;
  usuario_registro: any;
}

export interface Ingreso {
  id_ingreso: number;
  proyecto_id: string;
  monto_total: number;
  fecha_ingreso: string;
  tipo_ingreso: TipoIngreso;
  tipo_documento: string;
  anotaciones?: string;
  correlativo?: string;
  usuario_registro: any;
}

export interface Tarea {
  id: string;
  descripcion: string;
  estado: 'pendiente' | 'activa' | 'completada';
  asignadoA: {
    id: string;
    nombre: string;
  };
  fechaCreacion: string;
}

export interface ResumenFinancieroProps {
  data: {
    label: string;
    value: string;
    pill?: string;
    pillColor?: 'primary' | 'success' | 'error' | 'warning';
    buttonColor?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
    buttonLabel?: string;
    secondaryButtonLabel?: string;
    modalType?: 'ingreso' | 'pago' | 'movimientos';
  }[];
}

export interface Recurso {
  id: number;
  nombre: string;
  tipo: 'Maquinaria' | 'Herramienta';
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Inactivo';
  diasAsignados: string;
  asignadoA: string;
}

export interface Movimiento {
  id: string;
  cantidad: number;
  unidad: string;
  creadoPor: string;
  fecha: number;
  tipo: 'entrada' | 'salida';
}

export interface Personal {
  id: number;
  first_name: string;
  last_name: string;
  tipo: 'Ingeniero' | 'Arquitecto';
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Inactivo';
  diasAsignados: any[];
}

interface AmpliacionFecha {
  id: number;
  fecha: string;
  motivo: string;
  usuario: Usuario;
}

export interface AmpliacionPresupuesto {
  id: number;
  fecha: string;
  tipo: 'inicial' | 'ampliacion';
  motivo: string;
  monto?: number;
  usuario: string;
}

export interface ConfigProyecto {
  datosBasicos: {
    id: number;
    nombre: string;
    ubicacion: string;
    fechaInicio: string;
    fechaFin: string;
    presupuestoInicial: number;
    socio_asignado: Socio;
  };
  presupuestoTotal: number;
  totalIngresos: number;
  totalPagos: number;
  socios: Socio[];
  ampliacionesPresupuesto: AmpliacionPresupuesto[];
  ampliacionesFecha: AmpliacionFecha[];
  ingresos: Ingreso[];
  tiposIngreso: TipoIngreso[];
  pagos: Pago[];
  tiposPago: TipoPago[];
  maquinaria: Maquinaria[];
  asignacionesMaquinaria: AsignacionMaquinaria[];
  usuarios: Personal[];
  asignacionesPersonal: AsignacionPersonal[];
  revisiones: Revision[];
}
