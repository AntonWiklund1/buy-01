
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
  username: "1234567890",
  token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9TRUxMRVIiLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNzA0NDY4MTkzLCJleHAiOjE3MDQ1NTQ1OTN9._8UsrSi8JUKNcdccputL3yNjUjdctXr2bROPx2InyUc",
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
  on(AuthActions.logout, () => initialAuthState),
  // Handle the updateProfileSuccess action
  on(AuthActions.updateProfileSuccess, (state, { username, role }) => ({
    ...state,
    username,
    role
  })),
  // Add other action handlers as needed
);
