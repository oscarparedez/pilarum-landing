import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';

export interface Usuario {
  id: number;
  username: string;
  name: string;
  email?: string;
  is_active: boolean;
  [key: string]: any;
}

export const usePlanillaApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getUsuarios = useCallback(async (): Promise<Usuario[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
  }, [fetchWithAuth]);

  const crearUsuario = useCallback(
    async (usuario: Partial<Usuario>): Promise<Usuario> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) throw new Error('Error al crear usuario');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const actualizarUsuario = useCallback(
    async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/usuarios/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      if (!res.ok) throw new Error('Error al actualizar usuario');
      return await res.json();
    },
    [fetchWithAuth]
  );

  return {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
  };
};
