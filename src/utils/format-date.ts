import { format } from 'date-fns';

export const formatearFecha = (fecha: string | Date) => {
  const fechaLocal = typeof fecha === 'string' ? formatearFechaLocal(fecha) : fecha;
  return format(fechaLocal, 'dd LLL yyyy').toUpperCase();
};

export const formatearFechaLocal = (dateString: string): Date => {
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  // Asumimos que es YYYY-MM-DD, agregamos T12:00:00 para evitar desfases
  return new Date(dateString + 'T12:00:00');
};


export const formatearFechaLocalMasUno = (dateString: string): Date => {
  const date = formatearFechaLocal(dateString);
  date.setDate(date.getDate() + 1);
  return date;
};