import { Costo, Ingreso } from "src/api/types";


export function obtenerUltimoMovimiento(
  ingresos: Ingreso[],
  pagos: Costo[]
): { fecha: string; monto: number; tipo: 'Ingreso' | 'Costo' } | null {
  const movimientos = [
    ...ingresos.map((i) => ({
      tipo: 'Ingreso' as const,
      fecha: i.fecha_ingreso,
      monto: i.monto_total,
    })),
    ...pagos.map((p) => ({
      tipo: 'Costo' as const,
      fecha: p.fecha_pago,
      monto: p.monto_total,
    })),
  ];

  if (movimientos.length === 0) return null;

  return movimientos.reduce((a, b) =>
    new Date(a.fecha) > new Date(b.fecha) ? a : b
  );
}

export const transformarMovimientos = (ingresos: Ingreso[], costos: Costo[]) => {
  const ingresosTransformados = ingresos.map((i) => ({
    tipo: 'Ingreso' as const,
    fecha: i.fecha_ingreso,
    monto: i.monto_total,
    data: {
      ...i,
      fecha: i.fecha_ingreso,
    },
  }));

  const costosTransformados = costos.map((c) => ({
    tipo: 'Costo' as const,
    fecha: c.fecha_pago,
    monto: c.monto_total,
    data: {
      ...c,
      fecha: c.fecha_pago,
    },
  }));

  return [...ingresosTransformados, ...costosTransformados].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
};
