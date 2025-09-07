import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '@mui/material/SvgIcon';

import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import Settings03Icon from '@untitled-ui/icons-react/build/esm/Settings03';
import Settings02Icon from '@untitled-ui/icons-react/build/esm/Settings02';
import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import ClipboardIcon from '@untitled-ui/icons-react/build/esm/Clipboard';
import Truck01Icon from 'src/icons/untitled-ui/duocolor/truck-01';
import BuildingIcon from 'src/icons/untitled-ui/duocolor/building-04';

import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import { useHasPermission } from 'src/hooks/use-has-permissions';
import { PermissionId } from 'src/constants/roles/permissions';

export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: Item[];
  subheader?: string;
}

export const useSections = (): Section[] => {
  const { t } = useTranslation();

  const canViewSocios = useHasPermission(PermissionId.VER_SOCIOS);
  const canViewPlanilla = useHasPermission(PermissionId.VER_PLANILLA);
  const canViewRoles = useHasPermission(PermissionId.VER_ROLES_PERMISOS);
  const canViewIngresos = useHasPermission(PermissionId.VER_INGRESOS_GENERALES);
  const canViewCostos = useHasPermission(PermissionId.VER_COSTOS_GENERALES);
  const canViewInventario = useHasPermission(PermissionId.VER_INVENTARIO);
  const canViewHistorialOrdenesCompra = useHasPermission(PermissionId.VER_HIST_OC);
  const canViewHistorialRebajasInventario = useHasPermission(PermissionId.VER_HIST_REBAJAS);
  const canViewHistorialTrasladosInventario = useHasPermission(PermissionId.VER_HIST_TRASLADOS);
  const canViewMateriales = useHasPermission(PermissionId.VER_MATERIALES);
  const canViewUnidades = useHasPermission(PermissionId.VER_UNIDADES);
  const canViewMarcas = useHasPermission(PermissionId.VER_MARCAS);
  const canViewProveedores = useHasPermission(PermissionId.VER_PROVEEDORES);
  const canViewProyectos = useHasPermission(PermissionId.VER_PROYECTOS);
  const canViewTipoIngresos = useHasPermission(PermissionId.VER_TIPOS_INGRESO);
  const canViewTipoCostos = useHasPermission(PermissionId.VER_TIPOS_COSTO);
  const canViewMaquinaria = useHasPermission(PermissionId.VER_LISTA_MAQUINARIA);

  return useMemo(() => {
    // ----- Oficina -----
    const oficinaItems: Item[] = [];
    if (canViewSocios) {
      oficinaItems.push({
        title: t(tokens.nav.socios),
        path: paths.dashboard.oficina.socios,
        icon: <SvgIcon fontSize="small"><BuildingIcon /></SvgIcon>,
      });
    }
    if (canViewPlanilla) {
      oficinaItems.push({
        title: t(tokens.nav.personal),
        path: paths.dashboard.oficina.planilla,
        icon: <SvgIcon fontSize="small"><Users03Icon /></SvgIcon>,
      });
    }
    if (canViewRoles) {
      oficinaItems.push({
        title: t(tokens.nav.roles),
        path: paths.dashboard.oficina.roles,
        icon: <SvgIcon fontSize="small"><Settings03Icon /></SvgIcon>,
      });
    }

    const finanzasItems: Item[] = [];
    if (canViewIngresos) {
      finanzasItems.push({ title: t(tokens.nav.ingresosOficina), path: paths.dashboard.oficina.ingresos });
    }
    if (canViewCostos) {
      finanzasItems.push({ title: t(tokens.nav.costos), path: paths.dashboard.oficina.costos });
    }
    if (finanzasItems.length > 0) {
      oficinaItems.push({
        title: t(tokens.nav.finanzas),
        icon: <SvgIcon fontSize="small"><ClipboardIcon /></SvgIcon>,
        items: finanzasItems,
      });
    }

    const bodegaItems: Item[] = [];
    if (canViewInventario) {
      bodegaItems.push({ title: t(tokens.nav.inventario), path: paths.dashboard.oficina.inventario });
    }
    if (canViewHistorialOrdenesCompra) {
      bodegaItems.push({ title: 'Órdenes de Compra', path: paths.dashboard.oficina.ordenesCompra });
    }
    if (canViewHistorialRebajasInventario) {
      bodegaItems.push({ title: 'Rebajas de material', path: paths.dashboard.oficina.rebajas });
    }
    if (canViewHistorialTrasladosInventario) {
      bodegaItems.push({ title: 'Traslados de material', path: paths.dashboard.oficina.traslados });
    }
    if (canViewMateriales) {
      bodegaItems.push({ title: t(tokens.nav.materiales), path: paths.dashboard.oficina.materiales });
    }
    if (canViewUnidades) {
      bodegaItems.push({ title: t(tokens.nav.unidades), path: paths.dashboard.oficina.unidades });
    }
    if (canViewMarcas) {
      bodegaItems.push({ title: t(tokens.nav.marcas), path: paths.dashboard.oficina.marcas });
    }
    if (canViewProveedores) {
      bodegaItems.push({ title: t(tokens.nav.proveedores), path: paths.dashboard.oficina.proveedores });
    }
    if (bodegaItems.length > 0) {
      oficinaItems.push({
        title: t(tokens.nav.bodega),
        icon: <SvgIcon fontSize="small"><ShoppingBag03Icon /></SvgIcon>,
        items: bodegaItems,
      });
    }

    // ----- Proyectos -----
    const proyectosItems: Item[] = [];
    if (canViewProyectos) {
      proyectosItems.push({
        title: t(tokens.nav.proyectos),
        path: paths.dashboard.proyectos.index,
        icon: <SvgIcon><ClipboardIcon /></SvgIcon>,
      });
    }
    const configProyectosItems: Item[] = [];
    if (canViewTipoIngresos) {
      configProyectosItems.push({ title: t(tokens.nav.tipoIngresos), path: paths.dashboard.proyectos.configuracion.tipoIngresos });
    }
    if (canViewTipoCostos) {
      configProyectosItems.push({ title: t(tokens.nav.tipoPagos), path: paths.dashboard.proyectos.configuracion.tipoPagos });
    }
    if (configProyectosItems.length > 0) {
      proyectosItems.push({
        title: t(tokens.nav.configuracion),
        icon: <SvgIcon fontSize="small"><Settings02Icon /></SvgIcon>,
        items: configProyectosItems,
      });
    }

    // ----- Maquinaria -----
    const maquinariaItems: Item[] = [];
    if (canViewMaquinaria) {
      maquinariaItems.push({
        title: t(tokens.nav.maquinaria),
        path: paths.dashboard.maquinaria.index,
        icon: <SvgIcon fontSize="small"><Truck01Icon /></SvgIcon>,
      });
    }

    // ----- Secciones finales -----
    const sections: Section[] = [
      {
        subheader: 'General',
        items: [
          {
            title: t(tokens.nav.pizarron),
            path: paths.dashboard.inicio,
            icon: <SvgIcon fontSize="small"><HomeSmileIcon /></SvgIcon>,
          },
        ],
      },
      ...(oficinaItems.length > 0 ? [{ subheader: t(tokens.nav.oficina), items: oficinaItems }] : []),
      ...(proyectosItems.length > 0 ? [{ subheader: t(tokens.nav.proyectos), items: proyectosItems }] : []),
      ...(maquinariaItems.length > 0 ? [{ subheader: t(tokens.nav.maquinaria), items: maquinariaItems }] : []),
    ];

    return sections;
  }, [
    t,
    canViewSocios,
    canViewPlanilla,
    canViewRoles,
    canViewIngresos,
    canViewCostos,
    canViewInventario,
    canViewHistorialOrdenesCompra,
    canViewHistorialRebajasInventario,
    canViewHistorialTrasladosInventario,
    canViewMateriales,
    canViewUnidades,
    canViewMarcas,
    canViewProveedores,
    canViewProyectos,
    canViewTipoIngresos,
    canViewTipoCostos,
    canViewMaquinaria,
  ]);
};
