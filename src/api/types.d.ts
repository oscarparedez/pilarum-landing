export interface Usuario {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface AsignacionPersonal {
  id: number;
  usuario: any;
  dias_asignados: string[];
  fecha_entrada: string;
  fecha_fin: string;
}

export interface NuevaAsignacionPersonal {
  usuario_id: number;
  dias_asignados: string[];
  fecha_entrada: string;
  fecha_fin: string;
}

export interface AsignacionMaquinaria {
  id: number;
  equipo: Maquinaria;
  proyecto: Proyecto;
  usuario_recibe: any;
  dias_asignados: string[];
  fecha_entrada: string;
  fecha_fin: string;
}

export interface NuevaAsignacionMaquinaria {
  equipo: number;
  usuario_recibe: number;
  dias_asignados: string[];
  fecha_entrada: string;
  fecha_fin: string;
}

export interface FotoRevision {
  imagen: string;
}

export interface UsuarioPublico {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Revision {
  id: number;
  proyecto: number;
  titulo: string;
  anotaciones: string;
  fecha_review: string;
  anotaciones: string;
  fecha_creacion: string;
  usuario_creador: UsuarioPublico;
  fotos: FotoRevision[];
}

export interface NuevaRevision {
  titulo: string;
  anotaciones: string;
  fecha_review: string;
  anotaciones: string;
  fotos: File[];
}

export interface Unidad {
  id: number;
  nombre: string;
}

export interface NuevaUnidad {
  nombre: string;
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface NuevaMarca {
  nombre: string;
}

export interface Material {
  id: number;
  nombre: string;
  unidad: Unidad;
  marca: Marca;
}

export interface NuevoMaterial {
  nombre: string;
  unidad: number;
  marca: number;
}

export interface ConfigMaterial {
  materiales: Material[];
  unidades: Unidad[];
  marcas: Marca[];
}

export interface Socio {
  id: number;
  nombre: string;
  tipo: 'interno' | 'externo';
}

export interface Proyecto {
  id: number;
  nombre: string;
  ubicacion: string;
  presupuestoInicial: number;
  socio_asignado: Socio;
  fechaInicio: string;
  fechaFin: string;
}

export interface NuevoProyecto {
  nombre: string;
  ubicacion: string;
  presupuestoInicial: number;
  socio_asignado: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export type TipoGastoOperativo = 1 | 2; // 1 = combustible, 2 = servicio

export type TipoDocumento = 'cheque' | 'efectivo' | 'transferencia';

export interface NuevoGastoOperativo {
  descripcion: string;
  fecha: string;
  costo: number;
  tipo_gasto: TipoGastoOperativo;
  tipo_documento: TipoDocumento;
  fotos?: File[];
}

export interface GastoOperativo {
  id: number;
  equipo: number;
  descripcion: string;
  fecha_creacion: string;
  tipo_documento: TipoDocumento;
  fecha_gasto: string;
  costo: number;
  tipo_gasto: number;
  fotos?: FotoRevision[];
}

export interface TipoIngreso {
  id: number;
  nombre: string;
  fecha_creacion: string;
}

export interface IngresoGeneral {
  id: number;
  tipo_ingreso: TipoIngreso;
  usuario_creador: Usuario;
  monto_total: number;
  fecha_ingreso: string;
  fecha_creacion: string;
  tipo_documento: string;
  anotaciones: string;
  correlativo: string;
  proyecto: Proyecto;
}

export type TipoOrigenCosto =
  | 'proyecto'
  | 'orden de compra'
  | 'maquinaria'
  | 'equipo';

export interface CostoGeneral {
  origen_id: number;
  tipo_origen: TipoOrigenCosto;
  origen: string | null;      // nombre del proyecto, maquinaria, equipo o num. factura
  tipo_pago: string | number; // string en la mayoría, number (1|2) en maquinaria
  tipo_documento: string;
  monto: number;
  descripcion: string;
  fecha: string;              // ISO date
  usuario_registro: Usuario;  // ya tienes esta interface definida
}

export type TipoMaquinaria = 'maquinaria' | 'herramienta';
export type TipoDocumento = 'efectivo' | 'cheque' | 'transferencia';

export interface Maquinaria {
  id: number;
  nombre: string;
  tipo: TipoMaquinaria;
  identificador: string;
  costo: number;
  fecha_compra: string;      // formato 'YYYY-MM-DD'
  tipo_documento: TipoDocumento;
  anotaciones?: string;
  fecha_creacion: string;     // ISO date-time
  usuario_creador: Usuario;   // Ya tienes esta interface
}

export interface NuevaMaquinaria {
  nombre: string;
  tipo: TipoMaquinaria;
  identificador: string;
  costo: number;
  fecha_compra: string;      // 'YYYY-MM-DD'
  tipo_documento: TipoDocumento;
  anotaciones?: string;
}

export type CategoriaPendiente = 'proyecto' | 'maquinaria' | 'oficina' | 'otro';
export type EstadoPendiente = 'no_iniciado' | 'pendiente' | 'completado';

export interface NuevoPendiente {
  titulo: string;
  descripcion?: string;
  categoria: CategoriaPendiente;
  referencia_id: number | null;
  estado?: EstadoPendiente;
}

export interface Pendiente {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: CategoriaPendiente;
  referencia_id: number;
  estado: EstadoPendiente;
  fecha_creacion: string; // ISO date string
  fecha_completado: string | null; // puede ser null si no está completado
  usuario_creador: Usuario | null;
  usuario_completo: Usuario | null;
}