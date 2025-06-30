import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import type { User } from 'src/types/user';
import { Issuer } from 'src/utils/auth';
import type { State } from './auth-context';
import { AuthContext, initialState } from './auth-context';
import { useAuthApi } from 'src/api/auth/useAuthApi';

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
    };
  },
  SIGN_IN: (state: State, action: SignInAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
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

  const initialize = useCallback(async (): Promise<void> => {
    try {
      const user = await me();

      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: true,
          user,
        },
      });
    } catch (err) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [me]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const signIn = useCallback(
    async (username: string, password: string): Promise<void> => {
      await apiSignIn(username, password);
      const user = await me();

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
