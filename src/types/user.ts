export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: 'BRL' | 'USD' | 'EUR';
  language: 'pt' | 'en' | 'es';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
