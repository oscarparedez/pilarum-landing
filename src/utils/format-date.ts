import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatearFecha = (fecha: string | Date) => {
  const fechaLocal = typeof fecha === 'string' ? formatearFechaLocal(fecha) : fecha;
  return format(fechaLocal, 'dd LLL yyyy').toUpperCase();
};

export const formatearFechaLocal = (dateString: string): Date => {
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  // Asumimos que es YYYY-MM-DD, agregamos T12:00:00 para evitar desfases
  return new Date(dateString);
};


export const formatearFechaLocalMasUno = (dateString: string): Date => {
  const date = formatearFechaLocal(dateString);
  date.setDate(date.getDate() + 1);
  return date;
};

export const formatearFechaHora = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return format(date, "dd MMM yyyy", { locale: es });
};

export const esHoy = (fecha?: string) => {
  if (!fecha) return false;
  const date = new Date(fecha);
  const hoy = new Date();

  return (
    date.getFullYear() === hoy.getFullYear() &&
    date.getMonth() === hoy.getMonth() &&
    date.getDate() === hoy.getDate()
  );
};
