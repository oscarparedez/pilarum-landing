export interface Rol {
  id: string;
  nombre: string;
  permisos: {
    [grupo: string]: string[];
  };
}