import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  logout,
  getCurrentUser,
  register,
} from '@/services/auth.service';
import { LoginPayload, SignupPayload, UserProfile } from '@/types/auth';
import { apiClient } from '@/services/apiClient';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (data: LoginPayload) => Promise<void>;
  register: (data: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
  loadUserProfile: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      login: async (data: LoginPayload) => {
        set({ loading: true, error: null });
        try {
          const response = await login(data);

          apiClient.setToken(response.accessToken);

          const userProfile = await getCurrentUser();

          set({
            user: userProfile,
            token: response.accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao fazer login',
            loading: false,
          });
          throw error;
        }
      },

      register: async (data: SignupPayload) => {
        set({ loading: true, error: null });
        try {
          const response = await register(data);

          apiClient.setToken(response.accessToken);

          const userProfile = await getCurrentUser();

          set({
            user: userProfile,
            token: response.accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao criar conta',
            loading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logout();
        } catch (error) {
        } finally {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          apiClient.setToken(null);
        }
      },

      clearError: () => set({ error: null }),

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
        apiClient.setToken(token);

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },

      loadUserProfile: async () => {
        set({ loading: true, error: null });
        try {
          const userProfile = await getCurrentUser();
          set({
            user: userProfile,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao carregar perfil',
            loading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token);
        }
      },
    }
  )
);
