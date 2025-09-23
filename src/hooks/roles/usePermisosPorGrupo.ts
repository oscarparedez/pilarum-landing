import { useCallback, useEffect, useRef, useState } from 'react';
import { PERMISSION_LABEL_TO_ID } from 'src/constants/roles/permissions';

export type PermisosAgrupados = Record<string, Record<string, string[]>>;
export type Seleccionados = { [subgrupo: string]: string[] };

export const usePermisosPorGrupo = (permisos: PermisosAgrupados, initialIds: number[] = []) => {
  const idsToSeleccionados = useCallback(
    (ids: number[]): Seleccionados => {
      const next: Seleccionados = {};
      Object.entries(permisos).forEach(([_, subgrupos]) => {
        Object.entries(subgrupos).forEach(([subgrupo, labels]) => {
          const presentes = labels.filter((l) => ids.includes(PERMISSION_LABEL_TO_ID[l]));
          if (presentes.length) next[subgrupo] = presentes;
        });
      });
      return next;
    },
    [permisos]
  );

  const [seleccionados, setSeleccionados] = useState<Seleccionados>(idsToSeleccionados(initialIds));

  const originalIdsRef = useRef<number[]>([...initialIds].sort((a, b) => a - b));

  // ⚠️ Solo rehidratar si initialIds NO está vacío
  useEffect(() => {
    if (initialIds.length > 0) {
      setSeleccionados(idsToSeleccionados(initialIds));
      originalIdsRef.current = [...initialIds].sort((a, b) => a - b);
    }
  }, [initialIds, idsToSeleccionados]);

  const togglePermiso = useCallback((grupo: string, permiso: string) => {
    setSeleccionados((prev) => {
      const actual = prev[grupo] || [];
      return {
        ...prev,
        [grupo]: actual.includes(permiso)
          ? actual.filter((p) => p !== permiso)
          : [...actual, permiso],
      };
    });
  }, []);

  const seleccionarTodos = useCallback((grupo: string, lista: string[]) => {
    setSeleccionados((prev) => ({ ...prev, [grupo]: lista }));
  }, []);

  const deseleccionarTodos = useCallback((grupo: string) => {
    setSeleccionados((prev) => ({ ...prev, [grupo]: [] }));
  }, []);

  const estaSeleccionado = useCallback(
    (grupo: string, permiso: string) => seleccionados[grupo]?.includes(permiso) || false,
    [seleccionados]
  );

  const todosSeleccionados = useCallback(
    (grupo: string, total: string[]) => (seleccionados[grupo] || []).length === total.length,
    [seleccionados]
  );

  const cantidadSeleccionados = useCallback(
    (grupo: string) => seleccionados[grupo]?.length || 0,
    [seleccionados]
  );

  const selectedIds = useCallback((): number[] => {
    const ids = new Set<number>();
    Object.values(seleccionados).forEach((labels) => {
      labels.forEach((label) => {
        const id = PERMISSION_LABEL_TO_ID[label];
        if (id !== undefined) ids.add(id);
      });
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [seleccionados]);

  const isEqualToOriginal = useCallback(() => {
    const current = selectedIds();
    const original = originalIdsRef.current;
    if (current.length !== original.length) return false;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== original[i]) return false;
    }
    return true;
  }, [selectedIds]);

  const markAsSaved = useCallback(() => {
    originalIdsRef.current = selectedIds();
  }, [selectedIds]);

  return {
    seleccionados,
    setSeleccionados,
    togglePermiso,
    seleccionarTodos,
    deseleccionarTodos,
    estaSeleccionado,
    todosSeleccionados,
    cantidadSeleccionados,
    isEqualToOriginal,
    selectedIds,
    markAsSaved,
  };
};
