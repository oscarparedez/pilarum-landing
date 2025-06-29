export interface MovimientoBodega {
  id: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  usuario: string;
  fecha: string;
  origen?: string;
  destino?: string;
}

export interface MaterialBodega {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad: string;
  movimientos: MovimientoBodega[];
}