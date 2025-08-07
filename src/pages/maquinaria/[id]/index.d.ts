import { AsignacionMaquinaria, GastoOperativo } from "src/api/types";

export type TipoConsumo = 'combustible' | 'mantenimiento' | '';

export type TipoMaquinaria = 'maquinaria' | 'herramienta';

export interface GastoMaquinaria {
  tipo_gasto: TipoConsumo;
  fecha_creacion: string;
  anotaciones: string;
  solicitadoPor: { nombre: string; id: string };
  costo: number;
  fotos: string[];
}

export interface Asignacion {
  proyecto: string;
  fechaInicio: string;
  fechaFin: string;
  dias: string;
}

export interface ConfigMaquinaria {
  nombre: string;
  identificador?: string;
  tipo: TipoMaquinaria;
  costo: number;
  totalServicios: number;
  totalCombustibleUltimoMes: number;
  asignaciones: AsignacionMaquinaria[];
  servicios: GastoOperativo[];
  consumos: GastoOperativo[];
}
