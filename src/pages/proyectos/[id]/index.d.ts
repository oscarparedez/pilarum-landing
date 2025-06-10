// index.d.ts
export interface MaterialItem {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad: string;
}

export interface Pago {
  id_pago: string;
  proyecto_id: string;
  monto_total: number;
  fecha_pago: string;
  tipo_pago: string;
  tipo_documento: string;
  anotaciones: string;
  usuario_registro: string;
}

export interface Ingreso {
  id_ingreso: string;
  proyecto_id: string;
  monto_total: number;
  fecha_ingreso: string;
  tipo_ingreso: string;
  tipo_documento: string;
  anotaciones: string;
  usuario_registro: string;
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
  nombre: string;
  tipo: 'Ingeniero' | 'Arquitecto';
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Inactivo';
  diasAsignados: string;
}

export interface Revision {
  id: string;
  fecha: string;
  responsable: string;
  anotaciones: string;
  imagenes: string[];
}

interface AmpliacionFecha {
  fecha: string;
  motivo: string;
  usuario: string;
}

export interface AmpliacionPresupuesto {
  fecha: string;
  motivo: string;
  monto?: number;
  usuario: string;
}

export interface ConfigProyecto {
  datosBasicos: {
    nombre: string;
    ubicacion: string;
    fechaInicio: string;
    fechaFin: string;
    presupuestoInicial: number;
    socio: {
      id: string;
      nombre: string;
    }
  };
  ampliacionesPresupuesto: AmpliacionPresupuesto[];
  ampliacionesFecha: AmpliacionFecha[];
  ingresos: Ingreso[];
  pagos: Pago[];
  revisiones: Revision[];
  maquinaria: Recurso[];
  personal: Personal[];
  materialPlanificado: MaterialItem[];
}
