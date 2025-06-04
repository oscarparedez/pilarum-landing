export const diasToBinario = (dias: string[]): string => {
  const orden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  return orden.map((d) => (dias.includes(d) ? '1' : '0')).join('');
};

export const diasBinarioToTexto = (binario: string): string => {
  const abreviaturas = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  return binario
    .split('')
    .map((bit, i) => (bit === '1' ? abreviaturas[i] : null))
    .filter(Boolean)
    .join(' - ');
};
