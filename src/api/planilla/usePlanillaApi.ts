import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';
import { useAuthApi } from '../auth/useAuthApi';
import { NuevoUsuario, NuevoUsuarioConPassword, Usuario } from '../types';

export const usePlanillaApi = () => {
  const { fetchWithAuth } = useAuthApi();

  const getUsuarios = useCallback(async (): Promise<Usuario[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error al obtener usuarios');
    return await res.json();
  }, [fetchWithAuth]);

  const getUsuariosActivos = useCallback(async (): Promise<Usuario[]> => {
    const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/?active_only=true`, {
      method: 'GET',
    });

    if (!res.ok) throw new Error('Error al obtener usuarios activos');
    return await res.json();
  }, [fetchWithAuth]);

  const crearUsuario = useCallback(
    async (usuario: NuevoUsuarioConPassword): Promise<Usuario> => {
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

  const cambiarContrasenaAdmin = useCallback(
    async (id: number, data: { password: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/${id}/set_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: data.password }),
      });

      if (!res.ok) throw new Error('Error al cambiar contraseña (admin)');
      return await res.json();
    },
    [fetchWithAuth]
  );

  const cambiarContrasenaPropia = useCallback(
    async (data: { old_password: string; new_password: string }) => {
      const res = await fetchWithAuth(`${API_BASE_URL}/usuarios/change_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al cambiar tu contraseña');
      return await res.json();
    },
    [fetchWithAuth]
  );

  return {
    getUsuarios,
    getUsuariosActivos,
    crearUsuario,
    actualizarUsuario,
    cambiarContrasenaAdmin,
    cambiarContrasenaPropia,
  };
};
