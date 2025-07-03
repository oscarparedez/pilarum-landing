import { format } from 'date-fns';

export const formatearFecha = (fecha: string | Date) => {
  const fechaLocal = typeof fecha === 'string' ? formatearFechaLocal(fecha) : fecha;
  return format(fechaLocal, 'dd LLL yyyy').toUpperCase();
};

export const formatearFechaLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatearFechaLocalMasUno = (dateString: string): Date => {
  const date = formatearFechaLocal(dateString);
  date.setDate(date.getDate() + 1);
  return date;
};