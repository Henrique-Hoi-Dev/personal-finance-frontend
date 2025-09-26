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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
