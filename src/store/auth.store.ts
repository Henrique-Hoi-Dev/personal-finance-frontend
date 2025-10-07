import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  logout,
  getCurrentUser,
  getCurrentUserAvatar,
  register,
  updateUserPreferences,
  updateUserProfile,
  changePassword,
  updateUserAvatar,
} from '@/services/auth.service';
import {
  LoginPayload,
  SignupPayload,
  AuthState,
  AuthActions,
  UpdatePreferencesPayload,
  UpdateProfilePayload,
  PreferredLanguage,
} from '@/types/auth';
import { apiClient } from '@/services/apiClient';
import { Locale } from '@/i18n';

type AuthStore = AuthState & AuthActions;

// Mapeia PreferredLanguage para Locale
const mapPreferredLanguageToLocale = (
  preferredLanguage: PreferredLanguage
): Locale => {
  const mapping: Record<PreferredLanguage, Locale> = {
    [PreferredLanguage.PT_BR]: 'pt',
    [PreferredLanguage.EN_US]: 'en',
    [PreferredLanguage.ES_ES]: 'es',
    [PreferredLanguage.FR_FR]: 'fr',
    [PreferredLanguage.DE_DE]: 'de',
    [PreferredLanguage.IT_IT]: 'it',
    [PreferredLanguage.JA_JP]: 'ja',
    [PreferredLanguage.KO_KR]: 'ko',
    [PreferredLanguage.ZH_CN]: 'zh',
    [PreferredLanguage.RU_RU]: 'ru',
  };
  return mapping[preferredLanguage] || 'pt';
};

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

          // Redireciona para o dashboard no idioma preferido do usuário após login
          if (userProfile.preferredLanguage && typeof window !== 'undefined') {
            const preferredLocale = mapPreferredLanguageToLocale(
              userProfile.preferredLanguage as PreferredLanguage
            );
            const currentPath = window.location.pathname;
            const currentLocale = currentPath.split('/')[1];

            // Sempre redireciona para o dashboard no idioma preferido
            const dashboardPath = `/${preferredLocale}/dashboard`;

            // Se não estiver no dashboard correto, redireciona
            if (
              !currentPath.includes('/dashboard') ||
              currentLocale !== preferredLocale
            ) {
              window.location.href = dashboardPath;
            }
          } else {
            // Fallback: se não houver idioma preferido, vai para pt/dashboard
            if (typeof window !== 'undefined') {
              window.location.href = '/pt/dashboard';
            }
          }
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

          // Redireciona para o dashboard no idioma preferido do usuário após registro
          if (userProfile.preferredLanguage && typeof window !== 'undefined') {
            const preferredLocale = mapPreferredLanguageToLocale(
              userProfile.preferredLanguage as PreferredLanguage
            );
            const dashboardPath = `/${preferredLocale}/dashboard`;
            window.location.href = dashboardPath;
          } else {
            // Fallback: se não houver idioma preferido, vai para pt/dashboard
            if (typeof window !== 'undefined') {
              window.location.href = '/pt/dashboard';
            }
          }
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

      forceLogout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });

        apiClient.setToken(null);
      },

      updatePreferences: async (data: UpdatePreferencesPayload) => {
        set({ loading: true, error: null });
        try {
          const updatedUser = await updateUserPreferences(data);
          set({
            user: updatedUser,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao atualizar preferências',
            loading: false,
          });
          throw error;
        }
      },

      updateProfile: async (data: UpdateProfilePayload) => {
        set({ loading: true, error: null });
        try {
          const updatedUser = await updateUserProfile(data);
          set({
            user: updatedUser,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao atualizar perfil',
            loading: false,
          });
          throw error;
        }
      },

      changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
      }) => {
        set({ loading: true, error: null });
        try {
          await changePassword(data);
          set({ loading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao atualizar senha',
            loading: false,
          });
          throw error;
        }
      },

      updateAvatar: async (file: File) => {
        set({ loading: true, error: null });
        try {
          const updatedUser = await updateUserAvatar(file);
          // Carrega o avatar atualizado do servidor para garantir que temos a URL correta
          const avatarUrl = await getCurrentUserAvatar();
          // Atualiza apenas a URL do avatar, mantendo os outros dados do usuário
          set((state) => ({
            user: state.user ? { ...state.user, avatarUrl } : null,
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao atualizar avatar',
            loading: false,
          });
          throw error;
        }
      },

      loadAvatar: async () => {
        set({ loading: true, error: null });
        try {
          const avatarUrl = await getCurrentUserAvatar();
          set((state) => ({
            user: state.user ? { ...state.user, avatarUrl } : null,
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Erro ao carregar avatar',
            loading: false,
          });
          throw error;
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
