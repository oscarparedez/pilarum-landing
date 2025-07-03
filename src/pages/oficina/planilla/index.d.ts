export interface Usuario {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  telefono: string;
  rol: string; // "Ingeniero", "Arquitecto", etc.
  estado: 'Activo' | 'Inactivo';
  groups: number[]; // Ej: [1] para grupo de ingenieros
}
