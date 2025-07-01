import { GastoMaquinaria } from 'src/pages/maquinaria/[id]/index.d';

export const calcularTotalCombustibleUltimoMes = (gastosMaquinaria: GastoMaquinaria[]) => {
  if (!gastosMaquinaria || gastosMaquinaria.length === 0) return 0;

  const now = new Date();

  return gastosMaquinaria
    .filter((g) => {
      const fecha = new Date(g.fecha_creacion);
      return (
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear() &&
        g.tipo_gasto === 'combustible'
      );
    })
    .reduce((sum, g) => sum + (Number(g.costo) || 0), 0);
};

export const calcularTotalServicios = (gastosMaquinaria: GastoMaquinaria[]) => {
  if (!gastosMaquinaria || gastosMaquinaria.length === 0) return 0;

  return gastosMaquinaria
    .filter((g) => g.tipo_gasto === 'mantenimiento')
    .reduce((sum, g) => sum + (Number(g.costo) || 0), 0);
};
