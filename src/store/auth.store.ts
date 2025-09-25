import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, logout, getCurrentUser } from '@/services/auth.service';
import { LoginPayload, User } from '@/types/auth';
import { apiClient } from '@/services/apiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
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
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          apiClient.setToken(response.token);
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao fazer login',
            loading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logout();
        } catch (error) {
          // Ignore logout errors
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
          apiClient.setToken(null);
        }
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ loading: true });
        try {
          const user = await getCurrentUser();
          set({ user, loading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao carregar usuário',
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
        apiClient.setToken(token);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
