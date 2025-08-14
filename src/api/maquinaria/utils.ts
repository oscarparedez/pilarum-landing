import { GastoOperativo } from '../types';

export const calcularTotalCombustibleUltimoMes = (gastosMaquinaria: GastoOperativo[]) => {
  if (!gastosMaquinaria || gastosMaquinaria.length === 0) return 0;

  const now = new Date();

  return gastosMaquinaria
    .filter((g) => {
      const fecha = new Date(g.fecha_gasto);
      return (
        g.tipo_gasto === 1 &&
        fecha.getMonth() === now.getMonth() &&
        fecha.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, g) => sum + (Number(g.costo) || 0), 0);
};

export const calcularTotalServicios = (gastosMaquinaria: GastoOperativo[]) => {
  if (!gastosMaquinaria || gastosMaquinaria.length === 0) return 0;

  return gastosMaquinaria
    .filter((g) => g.tipo_gasto === 2)
    .reduce((sum, g) => sum + (Number(g.costo) || 0), 0);
};
