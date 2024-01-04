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
  token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9TRUxMRVIiLCJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNDM4OTkyNywiZXhwIjoxNzA0MzkxNzI3fQ.Wywew0U4g_KIrH34MCcBfPm-wEpISNCZSl9lh_p3A10",
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
