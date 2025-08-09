import { AsignacionMaquinaria, GastoOperativo, TipoDocumento } from "src/api/types";

export type TipoConsumo = 'combustible' | 'mantenimiento' | '';

export type TipoMaquinaria = 'maquinaria' | 'herramienta';

export interface Asignacion {
  proyecto: string;
  fechaInicio: string;
  fechaFin: string;
  dias: string;
}

export interface ConfigMaquinaria {
  id: number;
  nombre: string;
  identificador: string;
  tipo: TipoMaquinaria;
  costo: number;
  fecha_compra: string;
  tipo_documento: TipoDocumento;
  anotaciones?: string;
  totalServicios: number;
  totalCombustibleUltimoMes: number;
  asignaciones: AsignacionMaquinaria[];
  servicios: GastoOperativo[];
  consumos: GastoOperativo[];
}
