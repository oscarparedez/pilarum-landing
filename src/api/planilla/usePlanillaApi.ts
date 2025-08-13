import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevoUsuario, Usuario } from '../types';

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
    async (usuario: NuevoUsuario): Promise<Usuario> => {
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
    async (id: number, usuario: NuevoUsuario): Promise<Usuario> => {
      const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/${id}/`, {
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

  const cambiarContrasena = useCallback(
    async (id: number, data: { old_password: string; new_password: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/${id}/set_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al cambiar contraseña');
      return await res.json();
    },
    [fetchWithAuth]
  );

  return {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarContrasena,
  };
};
