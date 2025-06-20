// src/hooks/usePermisosPorGrupo.ts

import { useRef, useState } from 'react';

export const usePermisosPorGrupo = (
  permisos: Record<string, Record<string, string[]>>,
  initialSeleccionados: { [key: string]: string[] } = {}
) => {
  const [seleccionados, setSeleccionados] = useState<{ [key: string]: string[] }>(initialSeleccionados);
  const originalRef = useRef(initialSeleccionados);

  const togglePermiso = (grupo: string, permiso: string) => {
    setSeleccionados(prev => {
      const actual = prev[grupo] || [];
      return {
        ...prev,
        [grupo]: actual.includes(permiso)
          ? actual.filter(p => p !== permiso)
          : [...actual, permiso],
      };
    });
  };

  const seleccionarTodos = (grupo: string, lista: string[]) => {
    setSeleccionados(prev => ({
      ...prev,
      [grupo]: lista
    }));
  };

  const deseleccionarTodos = (grupo: string) => {
    setSeleccionados(prev => ({
      ...prev,
      [grupo]: []
    }));
  };

  const estaSeleccionado = (grupo: string, permiso: string) =>
    seleccionados[grupo]?.includes(permiso) || false;

  const todosSeleccionados = (grupo: string, total: string[]) =>
    (seleccionados[grupo] || []).length === total.length;

  const cantidadSeleccionados = (grupo: string) =>
    seleccionados[grupo]?.length || 0;

  const isEqualToOriginal = () =>
    JSON.stringify(seleccionados) === JSON.stringify(originalRef.current);

  return {
    seleccionados,
    togglePermiso,
    seleccionarTodos,
    deseleccionarTodos,
    estaSeleccionado,
    todosSeleccionados,
    cantidadSeleccionados,
    setSeleccionados,
    isEqualToOriginal
  };
};
