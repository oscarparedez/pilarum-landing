export interface UsuarioPublico {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  groups: { id: number; name: string, permissions: Number[] }[];
}

export interface Usuario {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  telefono?: string;
  usuario_creador: UsuarioPublico;
  groups?: { id: number; name: string, permissions: Number[] }[];
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

export interface NuevoUsuarioConPassword {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  telefono?: string;
  groups: number[];
}

export interface NuevoUsuario {
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  groups?: number[];
  telefono: string;
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
  materialPlanificado: InventarioConfig;
  revisiones: Revision[];
}

export interface AsignacionPersonal {
  id: number;
  usuario: any;
  dias_asignados: string[];
  fecha_entrada: string;
  fecha_fin: string;
}

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
  usuario_creador: UsuarioPublico;
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

export interface ActualizarRevision {
  titulo: string;
  anotaciones: string;
  fecha_review: string;
  mantener_ids: number[];
  fotos?: File[];
}

export interface Socio {
  id: number;
  nombre: string;
  tipo: 'interno' | 'externo';
  usuario_creador: UsuarioPublico;
}

export interface NuevoSocio {
  nombre: string;
  tipo: 'interno' | 'externo';
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

export interface Proveedor {
  id: number;
  nombre: string;
}

export interface NuevoProveedor {
  nombre: string;
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

export interface ActualizarGastoOperativo {
  descripcion: string;
  fecha: string;
  costo: number;
  tipo_gasto: TipoGastoOperativo;
  tipo_documento: TipoDocumento;
  mantener_ids: number[];
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
  usuario_creador: UsuarioPublico;
}

export interface TipoIngreso {
  id: number;
  nombre: string;
  fecha_creacion: string;
  usuario_creador: UsuarioPublico;
}

export interface NuevoTipoIngreso {
  nombre: string;
}

export interface TipoCosto {
  id: number;
  nombre: string;
  fecha_creacion: string;
  usuario_creador: UsuarioPublico;
}

export interface NuevoTipoCosto {
  nombre: string;
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
  fecha_creacion: string;    // ISO date-time
  fecha: string;              // ISO date
  usuario_registro: Usuario;  // ya tienes esta interface definida
}

export type TipoMaquinaria = 'maquinaria' | 'herramienta';
export type TipoDocumento = 'efectivo' | 'cheque' | 'transferencia';

export interface MaquinariaConfig {
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
  asignaciones: AsignacionMaquinaria[];
}

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

export interface Rol {
  id: number;
  name: string;
  permissions: number[];
}

export interface NuevoRol {
  name: string;
  permissions: number[];
}

export interface Inventario {
  id: number;
  material: Material;
  cantidad: number;
  precio_unitario: number;
  fecha_creacion: string;
  usuario_creador: UsuarioPublico;
}

export interface InventarioConfig {
  valor_total: number;
  inventarios: Inventario[];
}

export type TipoMovimiento = 1 | 2; // 1: Entrada, 2: Salida


export interface CompraMaterial {
  id: number;
  cantidad: string;
  precio_unitario: string;
  orden_compra: number;
  material: Material;
  usuario_creador: number;
}

export interface NuevaCompraMaterial {
  cantidad: string;
  precio_unitario: string;
  material: number;
}
interface NuevaCompraMaterialForm {
  cantidad: string;
  precio_unitario: string;
  material: Material | null; // objeto Material mientras editas
}

export interface OrdenCompra {
  id: number;
  fecha_factura: string;
  numero_factura: string;
  usuario_creador: UsuarioPublico;
  proveedor: Proveedor;
  tipo_documento: TipoDocumento;
  anotaciones?: string;
  fecha_creacion: string;
  compras: CompraMaterial[];
}

export interface NuevaOrdenCompra {
  proveedor: number;
  fecha_factura: string; 
  numero_factura: string;
  tipo_documento: TipoDocumento;
  anotaciones?: string;
  compras: NuevaCompraMaterial[];
}

// Detalle genérico de material en inventario (compartido)
export interface DetalleInventarioMaterial {
  id: number;
  inventario: {
    id: number;
    material: Material;
    cantidad: number;
    precio_unitario: string;
    fecha_creacion: string;
    usuario_creador: number;
  };
  cantidad: string; // la API devuelve string
}

export interface Rebaja {
  id: number;
  motivo: string | null;
  fecha_rebaja: string; // ISO string
  materiales: DetalleInventarioMaterial[];
  usuario_creador: UsuarioPublico;
}

export interface NuevaRebajaMaterial {
  inventario: number;
  cantidad: number;
}

export interface NuevaRebaja {
  fecha_rebaja: string;
  motivo: string;
  materiales: NuevaRebajaMaterial[];
}

export interface OrdenMovimientoInventario {
  id: number;
  fecha_movimiento: string;
  proyecto: Proyecto;
  motivo?: string | null;
  tipo_movimiento: TipoMovimiento;
  materiales: DetalleInventarioMaterial[];
  fecha_creacion: string;
  usuario_creador: UsuarioPublico;
}

export interface NuevoMovimientoMaterial {
  inventario: number;
  cantidad: number;
}

export interface NuevaOrdenMovimientoInventario {
  fecha_movimiento: string;
  proyecto?: number;
  motivo?: string;
  tipo_movimiento?: TipoMovimiento;
  materiales: NuevoMovimientoMaterial[];
}

export interface MovimientoDeInventario {
  id: number;
  orden_movimiento_id: number;
  tipo_movimiento: 1 | 2; // 1 = Entrada, 2 = Salida
  cantidad: string; // API devuelve string
  fecha_movimiento: string; // ISO string
  fecha_creacion: string;
  proyecto: Proyecto; // objeto completo
}

export interface InventarioConMovimientos {
  id: number;
  material: Material;
  cantidad: number;
  precio_unitario: string; // API devuelve string
  fecha_creacion: string;
  usuario_creador: number; // solo viene el id en este endpoint
  movimientos: MovimientoDeInventario[];
}