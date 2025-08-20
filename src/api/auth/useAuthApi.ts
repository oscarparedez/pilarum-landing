import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';

export const useAuthApi = () => {
  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const getAccessToken = () => getCookie('accessToken');
  const getRefreshToken = () => getCookie('refreshToken');

  const setTokens = (
    access: string,
    refresh: string,
    accessExpiresIn?: number,
    refreshExpiresIn?: number
  ) => {
    // Use backend-provided expiration times, or fallback to defaults
    const accessMaxAge = accessExpiresIn || 15 * 60; // 15 minutes default
    const refreshMaxAge = refreshExpiresIn || 7 * 24 * 60 * 60; // 7 days default

    // Use cookies as single source of truth
    document.cookie = `accessToken=${access}; Path=/; Secure; SameSite=Strict; Max-Age=${accessMaxAge}`;
    document.cookie = `refreshToken=${refresh}; Path=/; Secure; SameSite=Strict; Max-Age=${refreshMaxAge}`;
  };

  const clearTokens = () => {
    // Clear cookies only (single source of truth)
    document.cookie = 'accessToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  // New function: refresh token and fetch user info
  const refreshUserSession = async () => {
    try {
      const newAccess = await refreshAccessToken();
      // Fetch user info with new access token
      const res = await fetch(`${API_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${newAccess}` },
      });
      if (!res.ok) throw new Error('No autorizado');
      const user = await res.json();
      return user;
    } catch (err) {
      clearTokens();
      throw err;
    }
  };

  const signIn = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Credenciales inválidas');

    const data = await res.json();
    // Pass expiration times if backend provides them
    setTokens(
      data.access,
      data.refresh,
      data.access_expires_in, // Backend should provide this
      data.refresh_expires_in // Backend should provide this
    );
    return data;
  }, []);

  const signUp = useCallback(async (username: string, name: string, password: string) => {
    // const res = await fetch(`${API_BASE_URL}/register/`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, name, password }),
    // });
    // if (!res.ok) throw new Error('No se pudo registrar');
    // const data = await res.json();
    // // Pass expiration times if backend provides them
    // setTokens(
    //   data.access,
    //   data.refresh,
    //   data.access_expires_in,
    //   data.refresh_expires_in
    // );
    // return data;
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error('Refresh token inválido');

    const data = await res.json();
    // Backend provides access_expires_in for the new access token
    setTokens(data.access, refresh, data.access_expires_in);
    return data.access;
  }, []);

  const me = useCallback(async () => {
    const access = getAccessToken();
    if (!access) throw new Error('No autenticado');

    const res = await fetch(`${API_BASE_URL}/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    if (res.status === 401) {
      const newAccess = await refreshAccessToken();
      const retry = await fetch(`${API_BASE_URL}/me/`, {
        headers: { Authorization: `Bearer ${newAccess}` },
      });

      if (!retry.ok) throw new Error('Sesión inválida');
      return await retry.json();
    }

    if (!res.ok) throw new Error('No autorizado');
    return await res.json();
  }, [refreshAccessToken]);

  const signOut = useCallback(() => {
    clearTokens();
  }, []);

  // Wrapper con refresh automático
  const fetchWithAuth = useCallback(
    async (input: RequestInfo, init: RequestInit = {}) => {
      let access = getAccessToken() ?? '';

      const addAuth = (token: string): RequestInit => ({
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      let res = await fetch(input, addAuth(access));

      if (res.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error('No se pudo refrescar el token');

        access = newAccess;
        res = await fetch(input, addAuth(access));
      }

      return res;
    },
    [refreshAccessToken]
  );

  return {
    signIn,
    signUp,
    signOut,
    me,
    fetchWithAuth,
    getAccessToken,
    getRefreshToken,
    refreshUserSession,
  };
};
