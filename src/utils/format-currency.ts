export const formatearQuetzales = (valor: number): string => {
  return valor.toLocaleString('en-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
