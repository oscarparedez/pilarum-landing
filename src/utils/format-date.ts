import { format } from 'date-fns';

export const formatearFecha = (fecha: string | Date) => {
  return format(new Date(fecha), 'dd LLL yyyy').toUpperCase();
};

export const formatearFechaLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Mes empieza desde 0
};