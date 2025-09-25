import React, { useState } from 'react';
import { FormField } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { LoginPayload } from '@/types/auth';
import { useAuthStore } from '@/store/auth.store';

interface LoginFormProps {
  onSubmit?: (data: LoginPayload) => void;
  errorMessage?: string;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  errorMessage,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LoginPayload>({
    cpf: '',
    password: '',
  });

  const { login, loading: storeLoading, error: storeError } = useAuthStore();

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara do CPF
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14); // Limita a 14 caracteres (xxx.xxx.xxx-xx)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      const formattedCPF = formatCPF(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedCPF,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    } else {
      try {
        await login(formData);
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  const currentLoading = isLoading || storeLoading;
  const currentError = errorMessage || storeError;

  return (
    <div className="bg-white py-16 px-12 shadow-lg rounded-lg w-full max-w-xl">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <FormField
          label="CPF"
          type="text"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={handleInputChange}
          name="cpf"
          required
          autoComplete="username"
        />

        <FormField
          label="Senha"
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          required
          autoComplete="current-password"
        />

        <div className="pt-6">
          <Button type="submit" variant="primary" disabled={currentLoading}>
            {currentLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>

        {currentError && (
          <div className="text-center">
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md py-2 px-3">
              {currentError}
            </p>
          </div>
        )}
      </form>

      <div className="mt-8 text-center">
        <p className="text-base text-gray-600">
          Não tem conta?{' '}
          <a
            href="#"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
};
