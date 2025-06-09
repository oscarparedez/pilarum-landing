import { format } from 'date-fns';

export const formatearFecha = (fecha: string | Date) => {
  return format(new Date(fecha), 'dd LLL yyyy').toUpperCase();
};
