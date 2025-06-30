import { useCallback } from 'react';
import { API_BASE_URL } from 'src/config';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const useAuthApi = () => {
  const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const getRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY);

  const setTokens = (access: string, refresh: string) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  };

  const clearTokens = () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const signIn = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Credenciales inválidas');
    
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return data;
  }, []);

  const signUp = useCallback(async (username: string, name: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, password }),
    });

    if (!res.ok) throw new Error('No se pudo registrar');
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return data;
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
    setTokens(data.access, refresh);
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
  const fetchWithAuth = useCallback(async (input: RequestInfo, init: RequestInit = {}) => {
    let access = getAccessToken();
    const addAuth = (token: string) => ({
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    let res = await fetch(input, addAuth(access || ''));

    if (res.status === 401) {
      access = await refreshAccessToken();
      res = await fetch(input, addAuth(access));
    }

    return res;
  }, [refreshAccessToken]);

  return {
    signIn,
    signUp,
    signOut,
    me,
    fetchWithAuth,
    getAccessToken,
    getRefreshToken,
  };
};
