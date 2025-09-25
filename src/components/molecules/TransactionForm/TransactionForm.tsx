import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BaseButton, BaseInput, BaseLabel } from '@/components/atoms';
import { Conta } from '@/types';

interface TransactionFormProps {
  tipo: 'receita' | 'despesa';
  contas: Conta[];
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface TransactionFormData {
  valor: number;
  descricao: string;
  categoria: string;
  contaId: string;
  data: string;
  tipo: 'receita' | 'despesa';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  tipo,
  contas,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const t = useTranslations('Transacoes');

  const [formData, setFormData] = useState<TransactionFormData>({
    valor: 0,
    descricao: '',
    categoria: '',
    contaId: contas[0]?.id || '',
    data: new Date().toISOString().split('T')[0],
    tipo,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categorias = [
    { key: 'alimentacao', label: t('categories.alimentacao') },
    { key: 'transporte', label: t('categories.transporte') },
    { key: 'lazer', label: t('categories.lazer') },
    { key: 'saude', label: t('categories.saude') },
    { key: 'educacao', label: t('categories.educacao') },
    { key: 'trabalho', label: t('categories.trabalho') },
    { key: 'entretenimento', label: t('categories.entretenimento') },
    { key: 'utilities', label: t('categories.utilities') },
    { key: 'outros', label: t('categories.outros') },
  ];

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

    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = t('valueRequired');
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = t('descriptionRequired');
    }

    if (!formData.data) {
      newErrors.data = t('dateRequired');
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

  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Convert to number and format
    const number = parseInt(numericValue) / 100;

    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCurrencyChange = (value: string) => {
    const formatted = formatCurrency(value);
    const numericValue = parseFloat(
      formatted.replace(/\./g, '').replace(',', '.')
    );

    handleInputChange('valor', numericValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Valor */}
      <div>
        <BaseLabel htmlFor="valor">{t('value')} *</BaseLabel>
        <BaseInput
          id="valor"
          type="text"
          value={
            formData.valor > 0
              ? formatCurrency((formData.valor * 100).toString())
              : ''
          }
          onChange={(e) => handleCurrencyChange(e.target.value)}
          placeholder="0,00"
          error={errors.valor}
        />
      </div>

      {/* Descrição */}
      <div>
        <BaseLabel htmlFor="descricao">{t('description')} *</BaseLabel>
        <BaseInput
          id="descricao"
          type="text"
          value={formData.descricao}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          placeholder={t('transactionDescription')}
          error={errors.descricao}
        />
      </div>

      {/* Categoria */}
      <div>
        <BaseLabel htmlFor="categoria">{t('category')}</BaseLabel>
        <select
          id="categoria"
          value={formData.categoria}
          onChange={(e) => handleInputChange('categoria', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">{t('selectCategory')}</option>
          {categorias.map((categoria) => (
            <option key={categoria.key} value={categoria.key}>
              {categoria.label}
            </option>
          ))}
        </select>
      </div>

      {/* Conta */}
      <div>
        <BaseLabel htmlFor="conta">{t('account')}</BaseLabel>
        <select
          id="conta"
          value={formData.contaId}
          onChange={(e) => handleInputChange('contaId', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {contas.map((conta) => (
            <option key={conta.id} value={conta.id}>
              {conta.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Data */}
      <div>
        <BaseLabel htmlFor="data">{t('date')} *</BaseLabel>
        <div className="relative">
          <BaseInput
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange('data', e.target.value)}
            error={errors.data}
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
          {tipo === 'receita' ? t('addIncome') : t('addExpense')}
        </BaseButton>
      </div>
    </form>
  );
};
