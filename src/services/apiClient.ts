import { isTokenExpired } from '@/utils/jwt';
import { toast } from 'sonner';

interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'
  ) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      this.startTokenExpirationCheck();
    }
  }

  private startTokenExpirationCheck() {
    const checkInterval = setInterval(() => {
      if (this.token && isTokenExpired(this.token)) {
        console.warn('Token expirado detectado durante verificação periódica');
        this.handleTokenExpiration();
        clearInterval(checkInterval);
      }
    }, 1860000);
  }

  private handleTokenExpiration() {
    this.token = null;
    if (typeof window !== 'undefined') {
      // Importa o store dinamicamente para evitar dependência circular
      import('@/store/auth.store').then(({ useAuthStore }) => {
        const store = useAuthStore.getState();
        store.forceLogout();
      });

      toast.error('Sessão expirada. Faça login novamente.');

      // Redireciona para login
      window.location.href = '/pt/login';
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Verifica se o token está expirado antes de fazer a requisição
    if (this.token && isTokenExpired(this.token)) {
      this.handleTokenExpiration();
      throw new ApiError('Token expirado', 401);
    }

    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          this.handleTokenExpiration();
        }

        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Erro na requisição' };
        }

        throw new ApiError(
          errorData.message || 'Erro na requisição',
          response.status
        );
      }

      if (response.status === 204) {
        return {} as ApiResponse<T>;
      }

      try {
        const data = await response.json();
        return data;
      } catch {
        return {} as ApiResponse<T>;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erro de conexão', 0);
    }
  }

  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = new ApiClient();
export { ApiError };
