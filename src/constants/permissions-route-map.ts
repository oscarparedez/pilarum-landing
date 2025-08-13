// src/constants/permissions-route-map.ts
import { PermissionId } from 'src/pages/oficina/roles/permissions';
import { paths } from 'src/paths';

export const routePermissions: Record<string, number> = {
  // Oficina
  [paths.dashboard.oficina.socios]: PermissionId.VER_SOCIOS,
  [paths.dashboard.oficina.planilla]: PermissionId.VER_PLANILLA,
  [paths.dashboard.oficina.roles]: PermissionId.VER_ROLES_PERMISOS,
  [paths.dashboard.oficina.ingresos]: PermissionId.VER_INGRESOS_GENERALES,
  [paths.dashboard.oficina.costos]: PermissionId.VER_COSTOS_GENERALES,
  [paths.dashboard.oficina.inventario]: PermissionId.VER_INVENTARIO,
  [paths.dashboard.oficina.materiales]: PermissionId.VER_MATERIALES,
  [paths.dashboard.oficina.unidades]: PermissionId.VER_UNIDADES,
  [paths.dashboard.oficina.marcas]: PermissionId.VER_MARCAS,
  [paths.dashboard.oficina.proveedores]: PermissionId.VER_PROVEEDORES,

  // Proyectos
  [paths.dashboard.proyectos.index]: PermissionId.VER_PROYECTOS, // <-- ruta base protegida
  [paths.dashboard.proyectos.configuracion.tipoIngresos]: PermissionId.VER_TIPOS_INGRESO,
  [paths.dashboard.proyectos.configuracion.tipoPagos]: PermissionId.VER_TIPOS_COSTO,
  '/proyectos/material-planificado/trasladar': PermissionId.TRASLADAR_A_BODEGA_CENTRAL,

  // Maquinaria
  [paths.dashboard.maquinaria.index]: PermissionId.VER_LISTA_MAQUINARIA, // <-- ruta base protegida
};
