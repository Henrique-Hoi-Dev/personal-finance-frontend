import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BaseButton,
  BaseInput,
  BaseLabel,
  BaseToggleSwitch,
} from '@/components/atoms';
import { formatCurrency, formatCurrencyFromCents } from '@/utils';
import { UpdateContaPayload } from '@/types/contas';

interface ContaEditFormProps {
  onSubmit: (data: Omit<UpdateContaPayload, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData: {
    name: string;
    totalAmount: number;
    startDate: string;
    dueDay: number;
    isPreview?: boolean;
  };
}

export function ContaEditForm({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
}: ContaEditFormProps) {
  const t = useTranslations('Contas');
  const tCommon = useTranslations('Common');

  const [formData, setFormData] = useState({
    name: initialData.name,
    totalAmount: initialData.totalAmount,
    startDate: initialData.startDate,
    dueDay: initialData.dueDay,
  });

  const [isPreview, setIsPreview] = useState(initialData.isPreview || false);
  const [displayValue, setDisplayValue] = useState<string>(
    formatCurrencyFromCents(initialData.totalAmount)
  );

  const [errors, setErrors] = useState<{
    name?: string;
    totalAmount?: string;
    startDate?: string;
    dueDay?: string;
  }>({});

  const handleCurrencyChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    const amountInCents = parseInt(numericValue) || 0;

    setFormData((prev) => ({ ...prev, totalAmount: amountInCents }));
    setDisplayValue(formatCurrencyFromCents(amountInCents));

    if (errors.totalAmount) {
      setErrors((prev) => ({ ...prev, totalAmount: undefined }));
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpa erro se existir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = tCommon('validation.nameRequired');
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = tCommon('validation.totalAmountRequired');
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
      await onSubmit({
        name: formData.name,
        totalAmount: formData.totalAmount,
        startDate: formData.startDate,
        dueDay: formData.dueDay,
        isPreview: isPreview,
      });
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toggle Preview */}
      <div className="flex justify-start py-4 border-b border-gray-200">
        <BaseToggleSwitch
          checked={isPreview}
          onChange={setIsPreview}
          label={t('isPreview')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
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
        {/* Valor Total */}
        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('totalAmount')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="text"
            value={displayValue}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            placeholder={tCommon('placeholders.currency')}
            className={`w-full h-12 text-base ${
              errors.totalAmount ? 'border-red-500' : ''
            }`}
          />
          {errors.totalAmount && (
            <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>
          )}
        </div>

        {/* Data de Início */}
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

        {/* Dia de Vencimento */}
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

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <BaseButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          size="md"
        >
          {t('cancel')}
        </BaseButton>
        <BaseButton type="submit" variant="primary" loading={loading}>
          {loading ? t('updating') : t('update')}
        </BaseButton>
      </div>
    </form>
  );
}
