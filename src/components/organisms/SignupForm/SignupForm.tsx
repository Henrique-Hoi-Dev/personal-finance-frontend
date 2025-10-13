import React, { useState } from 'react';
import { PasswordField, FormField, SuccessModal } from '@/components/molecules';
import { BaseButton, BaseCPFInput, BaseLabel } from '@/components/atoms';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        // Mostra modal de sucesso antes do redirecionamento
        setShowSuccessModal(true);
      } catch (error) {
        // Só mostra toast de erro se realmente houve erro no registro
        toast.error(t('error_signup'));
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // O redirecionamento já aconteceu no store, mas se não aconteceu, força aqui
    if (typeof window !== 'undefined') {
      window.location.href = '/pt/dashboard';
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
          dataFormType="other"
          dataLpignore={true}
        />

        <div>
          <BaseLabel
            htmlFor="cpf"
            className="block text-base font-semibold text-gray-700 mb-2"
          >
            {t('cpf')} *
          </BaseLabel>
          <BaseCPFInput
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

      {/* Modal de Sucesso */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={t('success')}
        message={t('success')}
        onConfirm={handleSuccessModalClose}
      />
    </div>
  );
};
