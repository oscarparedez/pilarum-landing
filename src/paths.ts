import { id } from "date-fns/locale";

export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    login: '/auth/login',
  },
  dashboard: {
    inicio: '/dashboard',  
    oficina: {
      empresas: '/oficina/empresas',
      planilla: '/oficina/planilla',
      roles: '/oficina/roles',
      ingresos: '/oficina/ingresos',
      costos: '/oficina/costos',
      inventario: '/oficina/inventario',
      materiales: '/oficina/materiales',
      unidades: '/oficina/unidades',
      marcas: '/oficina/marcas',
      crear: '/oficina/inventario/crear',
      rebajar: '/oficina/inventario/rebajar',
      orden_de_compra: (id: string) => `/oficina/inventario/orden-de-compra/${id}`,
      rebaja: (id: string) => `/oficina/inventario/rebaja/${id}`,
    },
    proyectos: {
      index: '/proyectos',
      crear: '/proyectos/crear',
      detalle: (id: string) => `/proyectos/${id}`,
    },
    maquinaria: {
      index: '/maquinaria',
      crear: '/maquinaria/crear',
      detalle: (id: string) => `/maquinaria/${id}`,
    },
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats',
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists',
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs',
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500',
};
