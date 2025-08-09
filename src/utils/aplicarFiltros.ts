interface FiltroConfig {
  camposTexto: string[];
  campoFecha?: string;
  campoEstado?: string;
  campoEmpresa?: string;
}

interface FiltrosGlobales {
  search: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  estado?: 'Activo' | 'Inactivo' | 'Todos';
  empresa?: string;
}

export const aplicarFiltros = <T>(
  data: T[],
  filtros: FiltrosGlobales,
  config: FiltroConfig
): T[] => {
  const texto = (filtros.search ?? '').toLowerCase().trim();

  return data.filter((item) => {
    // 🔍 Texto combinado
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

    // 📆 Fecha
    let coincideFecha = true;
    if (config.campoFecha && filtros.fechaInicio && filtros.fechaFin) {
      const fechaItem = new Date((item as any)[config.campoFecha]);
      coincideFecha =
        !isNaN(fechaItem.getTime()) &&
        fechaItem >= filtros.fechaInicio &&
        fechaItem <= filtros.fechaFin;
    }

    // ✅ Estado
    let coincideEstado = true;
    if (config.campoEstado && filtros.estado && filtros.estado !== 'Todos') {
      const estadoItem = String((item as any)[config.campoEstado] ?? '').toLowerCase();
      coincideEstado = estadoItem === filtros.estado.toLowerCase();
    }

    // 🏢 Empresa
    let coincideEmpresa = true;
    if (config.campoEmpresa && filtros.empresa && filtros.empresa !== '') {
      const empresaValor = String(
        config.campoEmpresa.split('.').reduce((acc, key) => acc?.[key], item as any) ?? ''
      ).toLowerCase();
      coincideEmpresa = empresaValor === filtros.empresa.toLowerCase();
    }

    return coincideTexto && coincideFecha && coincideEstado && coincideEmpresa;
  });
};
