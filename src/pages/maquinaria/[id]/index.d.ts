export interface Servicio {
  tipo: 'Reparación' | 'Mantenimiento';
  fecha: string;
  solicitadoPor: { nombre: string; id: string };
  anotaciones: string;
  fotos: string[];
  costo: number;
}

export type TipoConsumo = 'diesel' | 'aceite' | 'gasolina' | '';

export type UnidadConsumo = 'litros' | 'galones' | '';

export interface Consumo {
  tipo: TipoConsumo;
  fecha: string;
  cantidad: string;
  unidad: UnidadConsumo;
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
  costo: number;
  totalServicios: number;
  totalCombustibleUltimoMes: number;
  asignaciones: Asignacion[];
  servicios: Servicio[];
  consumos: Consumo[];
}
