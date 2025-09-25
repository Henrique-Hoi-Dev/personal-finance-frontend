import React, { useState } from 'react';
import { FormField, PasswordField } from '@/components/molecules';
import { BaseButton } from '@/components/atoms';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { formatCPF, removeCPFMask } from '@/utils';
import { useAuthStore } from '@/store/auth.store';
import { SignupPayload } from '@/types';

interface SignupFormProps {
  onSubmit?: (data: SignupPayload) => void;
  errorMessage?: string;
  isLoading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  errorMessage,
  isLoading = false,
}) => {
  const t = useTranslations('Signup');
  const { register, loading: storeLoading, error: storeError } = useAuthStore();
  const [formData, setFormData] = useState<SignupPayload>({
    name: '',
    email: '',
    cpf: '',
    password: '',
  });

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
        await register(dataToSend);
        toast.success(t('success'));
      } catch (error) {
        toast.error(t('error_signup'));
      }
    }
  };

  return (
    <div className="bg-white py-16 px-12 shadow-lg rounded-lg w-full max-w-xl">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormField
          label={t('name')}
          type="text"
          placeholder={t('namePlaceholder')}
          value={formData.name}
          onChange={handleInputChange}
          name="name"
          required
          autoComplete="name"
        />

        <FormField
          label={t('email')}
          type="email"
          placeholder={t('emailPlaceholder')}
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          required
          autoComplete="email"
        />

        <FormField
          label={t('cpf')}
          type="text"
          placeholder={t('cpfPlaceholder')}
          value={formData.cpf}
          onChange={handleInputChange}
          name="cpf"
          required
          autoComplete="username"
        />

        <PasswordField
          label={t('password')}
          placeholder={t('passwordPlaceholder')}
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          required
          autoComplete="new-password"
          showStrength={true}
        />

        <div className="pt-6">
          <BaseButton
            type="submit"
            variant="primary"
            loading={isLoading || storeLoading}
            disabled={isLoading || storeLoading}
          >
            {t('submit')}
          </BaseButton>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-base text-gray-600">
          {t('login')}{' '}
          <a
            href="/pt/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t('login')}
          </a>
        </p>
      </div>
    </div>
  );
};
