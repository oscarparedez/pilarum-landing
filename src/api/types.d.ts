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
  proyecto: number;
  usuario_recibe: any;
  dias_asignados: string[];
  fecha_inicio: string;
  fecha_fin: string;
}

export interface NuevaAsignacionMaquinaria {
  equipo: number;
  proyecto: number;
  usuario_recibe: number;
  dias_asignados: string[];
  fecha_fin: string;
}