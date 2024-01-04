// src/app/state/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  userId: string | null;
  username: string | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  userId: "2",
  username: "admin",
  token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9TRUxMRVIiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNDM4MDI1NSwiZXhwIjoxNzA0MzgyMDU1fQ.zvIfCg16-Ot0zgV3yhNaH0jG9Y_iUDQ6323jBKJofes",
  role: "ROLE_SELLER",
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { userId, username, token, role }) => ({
    ...state,
    userId,
    username,
    token,
    role,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(AuthActions.logout, () => initialAuthState)
);
