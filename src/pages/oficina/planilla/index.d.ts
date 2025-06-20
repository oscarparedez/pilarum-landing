export interface Personal {
  id_usuario: string;
  nombre: string;
  telefono: string;
  rol: string;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion: string;
  usuario_registro: string;
}