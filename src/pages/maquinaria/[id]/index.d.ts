export interface Servicio {
  tipo: 'Reparación' | 'Mantenimiento';
  fecha: string;
  solicitadoPor: string;
  anotaciones: string;
  fotos: string[];
  costo: number;
}

export interface Consumo {
  tipo: 'Diesel' | 'Aceite' | 'Gasolina';
  fecha: string;
  cantidad: string;
  unidad: 'litros' | 'galones';
  anotaciones: string;
  reportadoPor: string;
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
  placa: string;
  costo: number;
  totalServicios: number;
  totalCombustibleUltimoMes: number;
  asignaciones: Asignacion[];
  servicios: Servicio[];
  consumos: Consumo[];
}
