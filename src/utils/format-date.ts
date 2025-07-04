import { format } from 'date-fns';

export const formatearFecha = (fecha: string | Date) => {
  const fechaLocal = typeof fecha === 'string' ? formatearFechaLocal(fecha) : fecha;
  return format(fechaLocal, 'dd LLL yyyy').toUpperCase();
};

export const formatearFechaLocal = (dateString: string): Date => {
  // Si es formato ISO con hora (contiene 'T'), usar new Date directamente
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  // Si es formato YYYY-MM-DD, parsear manualmente
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};


export const formatearFechaLocalMasUno = (dateString: string): Date => {
  const date = formatearFechaLocal(dateString);
  date.setDate(date.getDate() + 1);
  return date;
};