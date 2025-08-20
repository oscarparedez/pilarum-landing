import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';

import type { User } from 'src/types/user';
import { Issuer } from 'src/utils/auth';
import type { State } from './auth-context';
import { AuthContext, initialState } from './auth-context';
import { useAuthApi } from 'src/api/auth/useAuthApi';

const extractPermissions = (user: any) => {
  return user?.groups?.[0]?.permissions || [];
};

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  SIGN_OUT = 'SIGN_OUT',
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type SignInAction = {
  type: ActionType.SIGN_IN;
  payload: {
    user: User;
  };
};

type SignUpAction = {
  type: ActionType.SIGN_UP;
  payload: {
    user: User;
  };
};

type SignOutAction = {
  type: ActionType.SIGN_OUT;
};

type Action = InitializeAction | SignInAction | SignUpAction | SignOutAction;

type Handler = (state: State, action: any) => State;

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      permissions: extractPermissions(user),
    };
  },
  SIGN_IN: (state: State, action: SignInAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      permissions: extractPermissions(user),
    };
  },
  SIGN_UP: (state: State, action: SignUpAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_OUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const { signIn: apiSignIn, me, signOut: apiSignOut, refreshUserSession } = useAuthApi();
  // Store user info in localStorage
  const USER_INFO_KEY = 'userInfo';

  const signIn = useCallback(
    async (username: string, password: string): Promise<void> => {
      await apiSignIn(username, password);
      const user = await me();
      if (user.groups[0].permissions) {
        document.cookie = `permissions=${encodeURIComponent(
          JSON.stringify(extractPermissions(user))
        )}; path=/; secure; samesite=strict`;
      }
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
      dispatch({
        type: ActionType.SIGN_IN,
        payload: { user },
      });
      setIsLoading(false);
    },
    [apiSignIn, me]
  );

  const signUp = useCallback(
    async (username: string, name: string, password: string): Promise<void> => {
      //   await apiSignUp(username, name, password);
      //   const user = await me();

      //   dispatch({
      //     type: ActionType.SIGN_UP,
      //     payload: { user },
      //   });
      // },
      // [apiSignUp, me]
      throw new Error('Sign up is not implemented yet');
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    apiSignOut();
    localStorage.removeItem(USER_INFO_KEY);
    // Clear permissions cookie
    document.cookie = 'permissions=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    dispatch({ type: ActionType.SIGN_OUT });
    setIsLoading(false);
  }, [apiSignOut]);

  const initialize = useCallback(async () => {
    try {
      let user = null;
      // Helper function to get cookie value
      const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };

      const refreshToken = getCookie('refreshToken');

      if (refreshToken) {
        // If refresh token exists, use it to refresh the session and get user info
        user = await refreshUserSession();
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));

        // Set permissions cookie for the refreshed user
        if (user?.groups?.[0]?.permissions) {
          document.cookie = `permissions=${encodeURIComponent(
            JSON.stringify(extractPermissions(user))
          )}; path=/; secure; samesite=strict`;
        }
      }

      if (user) {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: { isAuthenticated: true, user },
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    } catch (error) {
      // If refresh fails, clear everything and sign out
      localStorage.removeItem(USER_INFO_KEY);
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'permissions=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      dispatch({
        type: ActionType.INITIALIZE,
        payload: { isAuthenticated: false, user: null },
      });
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserSession]);

  useEffect(() => {
    // Only run initialize on first mount
    if (!state.isInitialized) {
      initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        signUp,
        signOut,
        isLoading,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
