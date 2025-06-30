export interface Personal {
  id_usuario: string;
  usuario: string;
  nombre: string;
  telefono: string;
  rol: string;
  estado: 'Activo' | 'Inactivo' | 'FALTANTE';
  fecha_creacion: string;
  usuario_registro: string;
}