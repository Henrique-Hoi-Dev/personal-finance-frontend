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
  token: string;
  user: {
    id: string;
    name: string;
    cpf: string;
    email?: string;
  };
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
