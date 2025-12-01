'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BaseInput,
  BaseLabel,
  BaseButton,
  BaseToggleSwitch,
} from '@/components/atoms';
import { formatCurrencyFromCents } from '@/utils';
import { CreateContaPayload } from '@/types/contas';

interface LinkedAccountFormProps {
  onSubmit: (
    data: Omit<CreateContaPayload, 'userId' | 'type'>
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  creditCardId: string;
  creditCardDueDay?: number;
}

export function LinkedAccountForm({
  onSubmit,
  onCancel,
  loading = false,
  creditCardId,
  creditCardDueDay,
}: LinkedAccountFormProps) {
  const t = useTranslations('Contas');
  const tCommon = useTranslations('Common');

  // Calcular data de início baseada no mês atual
  const getInitialStartDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = '01';
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    startDate: getInitialStartDate(),
    dueDay: creditCardDueDay || 1,
    installments: 1,
    installmentAmount: 0,
  });

  const [hasInstallments, setHasInstallments] = useState(false);
  const [displayInstallmentValue, setDisplayInstallmentValue] =
    useState<string>('');

  // Atualizar dueDay quando creditCardDueDay mudar ou quando o componente montar
  useEffect(() => {
    if (creditCardDueDay && creditCardDueDay > 0) {
      setFormData((prev) => ({ ...prev, dueDay: creditCardDueDay }));
    }
  }, [creditCardDueDay]);

  const [errors, setErrors] = useState<{
    name?: string;
    installmentAmount?: string;
    installments?: string;
    startDate?: string;
    dueDay?: string;
  }>({});

  const handleInstallmentAmountChange = (inputValue: string) => {
    const numbersOnly = inputValue.replace(/\D/g, '');

    if (numbersOnly === '') {
      setDisplayInstallmentValue('');
      setFormData((prev) => ({ ...prev, installmentAmount: 0 }));
      return;
    }

    const valueInCents = parseInt(numbersOnly);

    setDisplayInstallmentValue(formatCurrencyFromCents(valueInCents));
    setFormData((prev) => ({ ...prev, installmentAmount: valueInCents }));

    if (errors.installmentAmount) {
      setErrors((prev) => ({ ...prev, installmentAmount: undefined }));
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

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = tCommon('validation.nameRequired');
    }

    if (hasInstallments) {
      if (formData.installmentAmount <= 0) {
        newErrors.installmentAmount =
          t('installmentAmountRequired') || 'Valor da parcela é obrigatório';
      }
      if (formData.installments < 1) {
        newErrors.installments = tCommon('validation.installmentsRequired');
      }
    } else {
      // Se não tiver parcelas, precisa ter valor total (calculado)
      if (formData.installmentAmount <= 0) {
        newErrors.installmentAmount =
          t('installmentAmountRequired') || 'Valor é obrigatório';
      }
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
      // Calcular valor total baseado em parcelas
      const totalAmount = hasInstallments
        ? formData.installmentAmount * formData.installments
        : formData.installmentAmount;

      const dataToSubmit: Omit<CreateContaPayload, 'userId' | 'type'> = {
        name: formData.name,
        totalAmount: totalAmount,
        startDate: formData.startDate,
        dueDay: formData.dueDay,
        isPreview: false,
        installments: hasInstallments ? formData.installments : undefined,
        installmentAmount: hasInstallments
          ? formData.installmentAmount
          : undefined,
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Erro ao criar conta vinculada:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toggle Parcelas */}
      <div className="flex justify-start py-4 border-b border-gray-200">
        <BaseToggleSwitch
          checked={hasInstallments}
          onChange={setHasInstallments}
          label={tCommon('hasInstallments') || 'Conta Parcelada'}
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

        {/* Valor da Parcela */}
        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {hasInstallments
              ? t('installmentAmount') || 'Valor da Parcela'
              : t('totalAmount') || 'Valor Total'}{' '}
            <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="text"
            value={displayInstallmentValue}
            onChange={(e) => handleInstallmentAmountChange(e.target.value)}
            placeholder={tCommon('placeholders.currency')}
            className={`w-full h-12 text-base ${
              errors.installmentAmount ? 'border-red-500' : ''
            }`}
          />
          {errors.installmentAmount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.installmentAmount}
            </p>
          )}
        </div>

        {/* Número de Parcelas - apenas se hasInstallments */}
        {hasInstallments && (
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
              className={`w-full h-12 text-base ${
                errors.installments ? 'border-red-500' : ''
              }`}
            />
            {errors.installments && (
              <p className="text-red-500 text-sm mt-1">{errors.installments}</p>
            )}
          </div>
        )}

        {/* Data de Início */}
        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('startDate')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            disabled={true}
            className={`w-full h-12 text-base bg-gray-100 cursor-not-allowed ${
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
            disabled={true}
            className={`w-full h-12 text-base bg-gray-100 cursor-not-allowed ${
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
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          size="md"
        >
          {loading ? t('creating') : t('createAndLink') || 'Criar e Vincular'}
        </BaseButton>
      </div>
    </form>
  );
}
