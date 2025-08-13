import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import type { User } from 'src/types/user';
import { Issuer } from 'src/utils/auth';
import type { State } from './auth-context';
import { AuthContext, initialState } from './auth-context';
import { useAuthApi } from 'src/api/auth/useAuthApi';

const extractPermissions = (user: any) => {
  return user?.groups?.[0]?.permissions || [];
};

const allPermissions = [
  0, 1, 2, 20, 21, 22, 23, 40, 41, 42, 43, 60, 70, 80, 81, 82, 83, 84, 85, 86,
  87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 200, 201, 202, 220,
  221, 222, 223, 224, 225, 226, 227, 228, 229, 240, 241, 242, 243, 250, 251,
  252, 253, 260, 261, 262, 263, 270, 271, 272, 273, 280, 281, 282, 290, 291,
  292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 310, 311, 312, 320,
  330, 331, 332, 333, 340, 341, 342, 343, 400, 401, 402
];


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
  const { signIn: apiSignIn, me, signOut: apiSignOut } = useAuthApi();

  const signIn = useCallback(
    async (username: string, password: string): Promise<void> => {
      await apiSignIn(username, password);
      const user = await me();

      if (user.groups[0].permissions) {
        document.cookie = `permissions=${encodeURIComponent(JSON.stringify(extractPermissions(user)))}; path=/; secure; samesite=strict`;
      }

      dispatch({
        type: ActionType.SIGN_IN,
        payload: { user },
      });
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
    dispatch({ type: ActionType.SIGN_OUT });
  }, [apiSignOut]);

  const initialize = useCallback(async () => {
    try {
      const user = await me(); // este ya refresca token si expira
      dispatch({
        type: ActionType.INITIALIZE,
        payload: { isAuthenticated: true, user },
      });
    } catch {
      signOut();
      dispatch({
        type: ActionType.INITIALIZE,
        payload: { isAuthenticated: false, user: null },
      });
    }
  }, [me, signOut]);

    useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
