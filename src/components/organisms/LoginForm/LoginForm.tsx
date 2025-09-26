import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordField } from '@/components/molecules';
import { BaseButton, CPFInput, BaseLabel } from '@/components/atoms';
import { LoginPayload } from '@/types/auth';
import { useAuthStore } from '@/store/auth.store';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { formatCPF, removeCPFMask } from '@/utils';

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
  const t = useTranslations('Login');
  const router = useRouter();
  const [formData, setFormData] = useState<LoginPayload>({
    cpf: '',
    password: '',
  });

  const { login, loading: storeLoading, error: storeError } = useAuthStore();

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

    // Remove a máscara do CPF antes de enviar
    const dataToSend = {
      ...formData,
      cpf: removeCPFMask(formData.cpf),
    };

    if (onSubmit) {
      onSubmit(dataToSend);
    } else {
      try {
        await login(dataToSend);
        // Redireciona após login bem-sucedido
        router.push('/pt/dashboard');
      } catch (error) {
        toast.error(t('error_login'));
      }
    }
  };

  const currentLoading = isLoading || storeLoading;
  const currentError = errorMessage || storeError;

  return (
    <div className="bg-white py-16 px-12 shadow-lg rounded-lg w-full max-w-xl">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <BaseLabel
            htmlFor="cpf"
            className="block text-base font-semibold text-gray-700 mb-2"
          >
            {t('cpf')} *
          </BaseLabel>
          <CPFInput
            id="cpf"
            name="cpf"
            placeholder={t('cpfPlaceholder')}
            value={formData.cpf}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>

        <PasswordField
          label={t('password')}
          placeholder={t('passwordPlaceholder')}
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          required
          autoComplete="current-password"
        />

        <div className="pt-6">
          <BaseButton
            type="submit"
            variant="primary"
            loading={currentLoading}
            disabled={currentLoading}
          >
            {t('submit')}
          </BaseButton>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-base text-gray-600">
          {t('signup')}{' '}
          <a
            href="/pt/signup"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t('signup')}
          </a>
        </p>
      </div>
    </div>
  );
};
