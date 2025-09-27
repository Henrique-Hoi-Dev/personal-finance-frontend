'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BaseInput,
  BaseLabel,
  BaseButton,
  BaseToggleSwitch,
  BaseSelect,
} from '@/components/atoms';
import { CreateContaPayload } from '@/types/contas';
import { formatCurrency } from '@/utils';
import { accountTypes } from '@/utils/enums';
import { useCustomOptions } from '@/hooks';

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
  const tCommon = useTranslations('Common');
  const [formData, setFormData] = useState<Omit<CreateContaPayload, 'userId'>>({
    name: '',
    type: 'FIXED',
    totalAmount: 0,
    installments: 1,
    startDate: '',
    dueDay: 1,
  });

  const [hasInstallments, setHasInstallments] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<CreateContaPayload, 'userId'>, string>>
  >({});

  const [displayValue, setDisplayValue] = useState<string>('');

  // Opções para o select de tipo de conta
  const tipoContaOptions = useCustomOptions(
    accountTypes.map((type) => ({
      value: type.value,
      label: type.label,
    }))
  );

  const handleCurrencyChange = (inputValue: string) => {
    const numbersOnly = inputValue.replace(/\D/g, '');

    if (numbersOnly === '') {
      setDisplayValue('');
      setFormData((prev) => ({ ...prev, totalAmount: 0 }));
      return;
    }

    const valueInCents = parseInt(numbersOnly);

    const valueInReais = valueInCents / 100;

    setDisplayValue(formatCurrency(valueInReais));
    setFormData((prev) => ({ ...prev, totalAmount: valueInCents }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof Omit<CreateContaPayload, 'userId'>, string>
    > = {};

    if (!formData.name.trim()) {
      newErrors.name = tCommon('validation.nameRequired');
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = tCommon('validation.totalAmountRequired');
    }

    if (hasInstallments && (formData.installments || 0) < 1) {
      newErrors.installments = tCommon('validation.installmentsRequired');
    }

    if (!formData.startDate) {
      newErrors.startDate = tCommon('validation.startDateRequired');
    }

    if (formData.dueDay < 1 || formData.dueDay > 31) {
      newErrors.dueDay = tCommon('validation.dueDayRequired');
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
      const dataToSubmit = hasInstallments
        ? formData
        : {
            name: formData.name,
            type: formData.type,
            totalAmount: formData.totalAmount,
            startDate: formData.startDate,
            dueDay: formData.dueDay,
          };

      await onSubmit(dataToSubmit);
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Toggle para parcelas no topo */}
      <div className="flex justify-start py-4 border-b border-gray-200">
        <BaseToggleSwitch
          checked={hasInstallments}
          onChange={setHasInstallments}
          label={tCommon('hasInstallments')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('namePlaceholder')}
            className={`w-full h-12 text-base ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('type')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseSelect
            value={formData.type}
            onChange={(value) =>
              handleInputChange('type', value as CreateContaPayload['type'])
            }
            options={tipoContaOptions}
            error={errors.type}
            size="lg"
          />
        </div>

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('totalAmount')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="text"
            value={displayValue}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            placeholder="R$ 0,00"
            className={`w-full h-12 text-base ${
              errors.totalAmount ? 'border-red-500' : ''
            }`}
          />
          {errors.totalAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>
          )}
        </div>

        {hasInstallments && (
          <div>
            <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
              {t('installments')} <span className="text-red-500">*</span>
            </BaseLabel>
            <BaseInput
              type="number"
              value={(formData.installments || 1).toString()}
              onChange={(e) =>
                handleInputChange('installments', parseInt(e.target.value) || 1)
              }
              placeholder="1"
              min="1"
              className={`w-full h-12 text-base ${
                errors.installments ? 'border-red-500' : ''
              }`}
            />
            {errors.installments && (
              <p className="text-red-500 text-sm mt-1">{errors.installments}</p>
            )}
          </div>
        )}

        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('startDate')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={`w-full h-12 text-base ${
              errors.startDate ? 'border-red-500' : ''
            }`}
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
            className={`w-full h-12 text-base ${
              errors.dueDay ? 'border-red-500' : ''
            }`}
          />
          {errors.dueDay && (
            <p className="text-red-500 text-sm mt-1">{errors.dueDay}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <BaseButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="h-12 px-6 text-base"
        >
          {t('cancel')}
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="h-12 px-6 text-base"
        >
          {loading ? t('creating') : t('create')}
        </BaseButton>
      </div>
    </form>
  );
}
