interface FiltroConfig {
  camposTexto: string[];
  campoFecha?: string;
  campoEstado?: string;
  campoEmpresa?: string;
  campoRol?: string;
  campoTipoIngresoId?: string;
  campoTipoOrigen?: string;
}

interface FiltrosGlobales {
  search: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  estado?: string;
  empresa?: string;
  rol?: string;
  tipoIngresoId?: number;
  tipoOrigen?: string;
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

    // 🧑‍💼 Rol
    let coincideRol = true;
    if (config.campoRol && filtros.rol && filtros.rol !== '') {
      const raw = config.campoRol.split('.').reduce((acc, key) => (acc as any)?.[key], item as any);

      // Normaliza el filtro recibido
      const filtroStr = String(filtros.rol).toLowerCase().trim();
      const filtroNum = Number.isNaN(Number(filtros.rol)) ? null : Number(filtros.rol);

      if (Array.isArray(raw)) {
        // raw === groups: [{ id, name, ... }]
        coincideRol = raw.some((g) => {
          const nameOk =
            String(g?.name ?? '')
              .toLowerCase()
              .trim() === filtroStr;
          const idOk = filtroNum !== null && g?.id === filtroNum;
          return nameOk || idOk;
        });
      } else if (raw && typeof raw === 'object') {
        // Por si fuera un solo objeto { id, name }
        const nameOk =
          String(raw?.name ?? '')
            .toLowerCase()
            .trim() === filtroStr;
        const idOk = filtroNum !== null && raw?.id === filtroNum;
        coincideRol = nameOk || idOk;
      } else {
        // Fallback si viniera un string
        coincideRol =
          String(raw ?? '')
            .toLowerCase()
            .trim() === filtroStr;
      }
    }

    // 🏷️ Tipo de ingreso (por id)
    let coincideTipoIngreso = true;
    if (config.campoTipoIngresoId && filtros.tipoIngresoId) {
      const raw = config.campoTipoIngresoId
        .split('.')
        .reduce((acc, key) => (acc as any)?.[key], item as any);
      const idNum = Number(raw);
      coincideTipoIngreso = Number.isFinite(idNum) && idNum === filtros.tipoIngresoId;
    }

    // 🧭 Tipo de origen (string exacto)
    let coincideTipoOrigen = true;
    if (config.campoTipoOrigen && filtros.tipoOrigen && filtros.tipoOrigen !== '') {
      const valor = String(
        config.campoTipoOrigen.split('.').reduce((acc, key) => (acc as any)?.[key], item as any) ?? ''
      ).toLowerCase().trim();
      coincideTipoOrigen = valor === filtros.tipoOrigen.toLowerCase().trim();
    }

    return (
      coincideTexto &&
      coincideFecha &&
      coincideEstado &&
      coincideEmpresa &&
      coincideRol &&
      coincideTipoIngreso &&
      coincideTipoOrigen
    );
  });
};
