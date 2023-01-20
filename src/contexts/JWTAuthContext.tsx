import axiosInt from '../utils/axios';
import PropTypes from 'prop-types';
import { createContext, FC, ReactNode, useEffect, useReducer, useState } from 'react';
import { User } from 'src/models/User';
import Home from 'src/pages/home';
import { Navigate } from 'react-router-dom';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  method: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: any | any;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: User;
  };
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axiosInt.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axiosInt.defaults.headers.common.Authorization;
  }
};

const handlers: Record<
  string,
  (state: AuthState, action: Action) => AuthState
> = {
  INITIALIZE: (state: AuthState, action: InitializeAction): AuthState => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: AuthState, action: LoginAction): AuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: AuthState): AuthState => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state: AuthState, action: RegisterAction): AuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state: AuthState, action: Action): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);

          const config = {
            headers: {
              Authorization: `Bearer ` + accessToken,
            }
          };

          axiosInt.get(
            'api/account', config
          )
            .then((data) => {
              const user = data.data;
              dispatch({
                type: 'INITIALIZE',
                payload: {
                  isAuthenticated: true,
                  user
                }
              });
            })
            .catch(function (error) {
         
            });

        } else {
        
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await axiosInt.post(
      '/api/authenticate',
      {
        email,
        password
      }
    ).then((res)=> { 

      let user=null;

      setSession(res.data.id_token);
      dispatch({
        type: 'INITIALIZE',
        payload: {
          user,
          isAuthenticated: true,
        }
      });
    })
     .catch((err)=> { 
       console.error('bad login')
     });
  };

  const logout = async (): Promise<void> => {
    const accessToken = window.localStorage.getItem('accessToken');

    const config = {
      headers: { Authorization: `Bearer `  }
    };

    await axiosInt.post(
      'api/signout', config
    );

    fetch('/keycloak.json').then((res)=>res.json()).then((data)=>{
      window.location.href = data.serverurl + "/realms/"+ data.realm +"/protocol/openid-connect/logout";
    })

                            
    setSession(null);
    dispatch({ type: 'LOGOUT' });

  };

  const register = async (
    email: string,
    name: string,
    password: string
  ): Promise<void> => {

    const response = await axiosInt.post<{ accessToken: string; user: User }>(
      '/api/account/register',
      {
        email,
        name,
        password
      }
    );
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
