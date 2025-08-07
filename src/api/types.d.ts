export interface Maquinaria {
  id: number;
  tipo: 'maquinaria' | 'herramienta';
  nombre: string;
  identificador?: string;
  costo: number;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  [key: string]: any;
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
  socioAsignado: Socio;
  fechaInicio: string;
  fechaFin: string;
}

export interface NuevoProyecto {
  nombre: string;
  ubicacion: string;
  presupuestoInicial: number;
  socioAsignado: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export type TipoGastoOperativo = 1 | 2; // 1 = combustible, 2 = servicio

export interface NuevoGastoOperativo {
  descripcion: string;
  fecha: string;
  costo: number;
  tipo_gasto: TipoGastoOperativo;
  fotos?: File[];
}

export interface GastoOperativo {
  id: number;
  equipo: number;
  descripcion: string;
  fecha_creacion: string;
  fecha_gasto: string;
  costo: number;
  tipo_gasto: number;
  fotos?: FotoRevision[];
}
