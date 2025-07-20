// src/utils/aplicarFiltros.ts

interface FiltroConfig {
  camposTexto: string[];     // ['first_name', 'tipo.nombre']
  campoFecha?: string;       // 'fecha_ingreso' o similar
}

interface FiltrosGlobales {
  search: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

export const aplicarFiltros = <T>(
  data: T[],
  filtros: FiltrosGlobales,
  config: FiltroConfig
): T[] => {
  const texto = (filtros.search ?? '').toLowerCase().trim();

  return data.filter((item) => {
    // 🔍 Texto combinado de todos los campos
    const textoConcatenado = config.camposTexto
      .map((path) => {
        try {
          return String(
            path.split('.').reduce((acc, key) => acc?.[key], item as any) ?? ''
          ).toLowerCase();
        } catch {
          return '';
        }
      })
      .join(' ');

    const coincideTexto = texto === '' || textoConcatenado.includes(texto);

    // 📆 Validación de fecha
    let coincideFecha = true;
    if (config.campoFecha && filtros.fechaInicio && filtros.fechaFin) {
      const fechaItem = new Date((item as any)[config.campoFecha]);
      coincideFecha =
        !isNaN(fechaItem.getTime()) &&
        fechaItem >= filtros.fechaInicio &&
        fechaItem <= filtros.fechaFin;
    }

    return coincideTexto && coincideFecha;
  });
};
