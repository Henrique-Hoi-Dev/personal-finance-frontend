export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (data: LoginPayload) => Promise<void>;
  register: (data: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
  loadUserProfile: () => Promise<void>;
  forceLogout: () => void;
  updatePreferences: (data: UpdatePreferencesPayload) => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  loadAvatar: () => Promise<void>;
}

export interface LoginPayload {
  cpf: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: Date;
  defaultCurrency: string;
  preferredLanguage: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  defaultCurrency: string;
  preferredLanguage: string;
}

export interface UpdatePreferencesPayload {
  defaultCurrency?: string;
  preferredLanguage?: string;
}

export enum CurrencyCode {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  CHF = 'CHF',
  CNY = 'CNY',
  ARS = 'ARS',
  CLP = 'CLP',
  COP = 'COP',
  MXN = 'MXN',
  PEN = 'PEN',
}

export enum PreferredLanguage {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES',
  FR_FR = 'fr-FR',
  DE_DE = 'de-DE',
  IT_IT = 'it-IT',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR',
  ZH_CN = 'zh-CN',
  RU_RU = 'ru-RU',
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  default_currency?: CurrencyCode;
  preferred_language?: PreferredLanguage;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
