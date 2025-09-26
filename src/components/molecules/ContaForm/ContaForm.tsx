'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BaseInput, BaseLabel, BaseButton } from '@/components/atoms';
import { CreateContaPayload } from '@/types/contas';

interface ContaFormProps {
  onSubmit: (data: Omit<CreateContaPayload, 'userId'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ContaForm({
  onSubmit,
  onCancel,
  loading = false,
}: ContaFormProps) {
  const t = useTranslations('Contas');
  const [formData, setFormData] = useState<Omit<CreateContaPayload, 'userId'>>({
    name: '',
    type: 'FIXED',
    totalAmount: 0,
    installments: 1,
    startDate: '',
    dueDay: 1,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<CreateContaPayload, 'userId'>, string>>
  >({});

  const accountTypes = [
    { value: 'FIXED', label: 'Fixa' },
    { value: 'LOAN', label: 'Empréstimo' },
    { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
    { value: 'SUBSCRIPTION', label: 'Assinatura' },
    { value: 'OTHER', label: 'Outro' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof Omit<CreateContaPayload, 'userId'>, string>
    > = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Valor total deve ser maior que zero';
    }

    if (formData.installments < 1) {
      newErrors.installments = 'Número de parcelas deve ser pelo menos 1';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    if (formData.dueDay < 1 || formData.dueDay > 31) {
      newErrors.dueDay = 'Dia de vencimento deve ser entre 1 e 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

  const handleInputChange = (
    field: keyof Omit<CreateContaPayload, 'userId'>,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('namePlaceholder')}
            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('type')} <span className="text-red-500">*</span>
          </BaseLabel>
          <select
            value={formData.type}
            onChange={(e) =>
              handleInputChange(
                'type',
                e.target.value as CreateContaPayload['type']
              )
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('totalAmount')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="number"
            value={formData.totalAmount.toString()}
            onChange={(e) =>
              handleInputChange('totalAmount', parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full ${errors.totalAmount ? 'border-red-500' : ''}`}
          />
          {errors.totalAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>
          )}
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('installments')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="number"
            value={formData.installments.toString()}
            onChange={(e) =>
              handleInputChange('installments', parseInt(e.target.value) || 1)
            }
            placeholder="1"
            min="1"
            className={`w-full ${errors.installments ? 'border-red-500' : ''}`}
          />
          {errors.installments && (
            <p className="text-red-500 text-sm mt-1">{errors.installments}</p>
          )}
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('startDate')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={`w-full ${errors.startDate ? 'border-red-500' : ''}`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('dueDay')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="number"
            value={formData.dueDay.toString()}
            onChange={(e) =>
              handleInputChange('dueDay', parseInt(e.target.value) || 1)
            }
            placeholder="1"
            min="1"
            max="31"
            className={`w-full ${errors.dueDay ? 'border-red-500' : ''}`}
          />
          {errors.dueDay && (
            <p className="text-red-500 text-sm mt-1">{errors.dueDay}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {t('cancel')}
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {loading ? t('creating') : t('create')}
        </BaseButton>
      </div>
    </form>
  );
}
