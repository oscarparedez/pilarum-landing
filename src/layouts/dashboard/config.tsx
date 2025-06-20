import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SvgIcon from '@mui/material/SvgIcon';

import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import Settings03Icon from '@untitled-ui/icons-react/build/esm/Settings03';
import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import ClipboardIcon from '@untitled-ui/icons-react/build/esm/Clipboard';
import Truck01Icon from 'src/icons/untitled-ui/duocolor/truck-01';

import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';

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

  return useMemo(
    () => [
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
      {
        subheader: t(tokens.nav.oficina),
        items: [
          {
            title: t(tokens.nav.personal),
            path: paths.dashboard.oficina.planilla,
            icon: <SvgIcon fontSize="small"><Users03Icon /></SvgIcon>,
          },
          {
            title: t(tokens.nav.roles),
            path: paths.dashboard.oficina.roles,
            icon: <SvgIcon fontSize="small"><Settings03Icon /></SvgIcon>,
          },
          {
            title: t(tokens.nav.finanzas),
            icon: <SvgIcon fontSize="small"><ClipboardIcon /></SvgIcon>,
            items: [
              { title: t(tokens.nav.ingresosOficina), path: paths.dashboard.oficina.ingresos },
              { title: t(tokens.nav.costos), path: paths.dashboard.oficina.costos },
            ],
          },
          {
            title: t(tokens.nav.materiales),
            path: paths.dashboard.oficina.materiales,
            icon: <SvgIcon fontSize="small"><ShoppingBag03Icon /></SvgIcon>,
            items: [
              { title: t(tokens.nav.movimientos), path: paths.dashboard.oficina.movimientos },
            ],
          },
        ],
      },
      {
        subheader: t(tokens.nav.proyectos),
        items: [
          {
            title: t(tokens.nav.proyectos),
            path: paths.dashboard.proyectos.index,
            icon: <SvgIcon><ClipboardIcon /></SvgIcon>,
          }
        ],
      },
      {
        subheader: t(tokens.nav.maquinaria),
        items: [
          {
            title: t(tokens.nav.maquinaria),
            path: paths.dashboard.maquinaria.index,
            icon: <SvgIcon fontSize="small"><Truck01Icon /></SvgIcon>,
          },
        ],
      },
    ],
    [t]
  );
};

