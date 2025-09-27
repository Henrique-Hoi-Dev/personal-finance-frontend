import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BaseButton,
  BaseInput,
  BaseLabel,
  BaseSelect,
} from '@/components/atoms';
import { formatCurrency } from '@/utils';
import { useCategoriesStore } from '@/store/categories.store';
import { useEndpointOptions, useEnumOptions } from '@/hooks';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface TransactionFormData {
  value: number;
  description: string;
  category: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const t = useTranslations('Transacoes');
  const tCommon = useTranslations('Common');
  const { categories, fetchCategories } = useCategoriesStore();

  const [formData, setFormData] = useState<TransactionFormData>({
    value: 0,
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE', // Default to expense
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [displayValue, setDisplayValue] = useState<string>('');

  // Carrega as categorias quando o componente monta
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoriasFiltradas = categories.filter(
    (category) => category.type === formData.type
  );

  const tipoOptions = useEnumOptions(
    { INCOME: 'INCOME', EXPENSE: 'EXPENSE' },
    { INCOME: t('income'), EXPENSE: t('expense') }
  );

  const categoriaOptions = useEndpointOptions(
    categoriasFiltradas,
    'name',
    'ptBr',
    t('selectCategory')
  );

  const handleInputChange = (
    field: keyof TransactionFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.value || formData.value <= 0) {
      newErrors.value = t('valueRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired');
    }

    if (!formData.date) {
      newErrors.date = t('dateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCurrencyChange = (inputValue: string) => {
    const numbersOnly = inputValue.replace(/\D/g, '');

    if (numbersOnly === '') {
      setDisplayValue('');
      setFormData((prev) => ({ ...prev, value: 0 }));
      return;
    }

    const valueInCents = parseInt(numbersOnly);
    const valueInReais = valueInCents / 100;

    setDisplayValue(formatCurrency(valueInReais));
    setFormData((prev) => ({ ...prev, value: valueInCents }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo de Transação */}
      <BaseSelect
        value={formData.type}
        onChange={(value) => {
          const newType = value as 'INCOME' | 'EXPENSE';
          handleInputChange('type', newType);
          // Reset category when type changes
          handleInputChange('category', '');
        }}
        options={tipoOptions}
        label={t('transactionType')}
        required
      />

      {/* Descrição */}
      <div>
        <BaseLabel htmlFor="description">{t('description')} *</BaseLabel>
        <BaseInput
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder={t('transactionDescription')}
          error={errors.description}
        />
      </div>

      {/* Categoria */}
      <BaseSelect
        value={formData.category}
        onChange={(value) => handleInputChange('category', value)}
        options={categoriaOptions}
        label={t('category')}
      />

      {/* Data */}
      <div>
        <BaseLabel htmlFor="date">{t('date')} *</BaseLabel>
        <div className="relative">
          <BaseInput
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={errors.date}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Valor */}
      <div>
        <BaseLabel htmlFor="value">{t('value')} *</BaseLabel>
        <BaseInput
          id="value"
          type="text"
          value={displayValue}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          placeholder={tCommon('placeholders.currency')}
          error={errors.value}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          fullWidth={false}
          className="flex-1 max-h-12"
        >
          {t('cancel')}
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth={false}
          className="flex-1 max-h-12"
        >
          {t('addTransaction')}
        </BaseButton>
      </div>
    </form>
  );
};
