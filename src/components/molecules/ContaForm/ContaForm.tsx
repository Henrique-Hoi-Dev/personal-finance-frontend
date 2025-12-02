'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BaseInput,
  BaseLabel,
  BaseButton,
  BaseToggleSwitch,
  BaseSelect,
  BaseModal,
} from '@/components/atoms';
import { CreateContaPayload } from '@/types/contas';
import { formatCurrency } from '@/utils';
import { accountTypes } from '@/utils/enums';
import { useCustomOptions } from '@/hooks';

interface ContaFormProps {
  onSubmit: (data: Omit<CreateContaPayload, 'userId'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<Omit<CreateContaPayload, 'userId'>>;
  month?: number;
  year?: number;
}

// Função helper para calcular data de início baseada no mês/ano
const getInitialStartDate = (month?: number, year?: number): string => {
  const now = new Date();
  const targetMonth = month || now.getMonth() + 1;
  const targetYear = year || now.getFullYear();
  const day = '01';
  const monthStr = String(targetMonth).padStart(2, '0');
  return `${targetYear}-${monthStr}-${day}`;
};

export function ContaForm({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  month,
  year,
}: ContaFormProps) {
  const t = useTranslations('Contas');
  const tCommon = useTranslations('Common');
  
  // Calcular data de início fixa baseada no mês/ano
  const fixedStartDate = getInitialStartDate(month, year);
  const isStartDateFixed = month !== undefined && year !== undefined;
  
  const [formData, setFormData] = useState<Omit<CreateContaPayload, 'userId'>>({
    name: initialData?.name || '',
    type: initialData?.type || 'FIXED',
    totalAmount: initialData?.totalAmount || 0,
    installments: initialData?.installments || 1,
    startDate: initialData?.startDate || (isStartDateFixed ? fixedStartDate : ''),
    dueDay: initialData?.dueDay || 1,
    creditLimit: initialData?.creditLimit || 0,
    closingDate: initialData?.closingDate || 1,
  });
  
  // Atualizar data de início quando month/year mudarem
  useEffect(() => {
    if (isStartDateFixed) {
      const newStartDate = getInitialStartDate(month, year);
      setFormData((prev) => ({ ...prev, startDate: newStartDate }));
    }
  }, [month, year, isStartDateFixed]);

  const [hasInstallments, setHasInstallments] = useState(
    initialData?.installments ? initialData.installments > 1 : false
  );
  const [installmentValue, setInstallmentValue] = useState<string>('');
  const [parceledInstallmentValue, setParceledInstallmentValue] =
    useState<string>('');
  const [isPreview, setIsPreview] = useState(initialData?.isPreview || false);

  // Helper de cálculo por parcela (UX apenas)
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcSyncEnabled, setCalcSyncEnabled] = useState(true);
  const [calcInstallmentValue, setCalcInstallmentValue] = useState<string>('');

  // Função para verificar se preview deve estar desabilitado
  const isPreviewDisabled = () => {
    return formData.type === 'LOAN' || formData.type === 'CREDIT_CARD' || formData.type === 'DEBIT_CARD';
  };

  // Função para verificar se parcelamento deve estar forçado
  const isInstallmentsForced = () => {
    return formData.type === 'FIXED' && !isPreview;
  };

  // Função para verificar se parcelamento deve estar desabilitado
  const isInstallmentsDisabled = () => {
    // Quando preview estiver selecionado no tipo FIXED, não pode ter parcelas
    // Cartão de crédito e cartão de débito não podem ter parcelas
    return (
      (formData.type === 'FIXED' && isPreview) ||
      formData.type === 'CREDIT_CARD' ||
      formData.type === 'DEBIT_CARD'
    );
  };

  // Função para verificar se parcelamento deve estar bloqueado (não pode desativar)
  const isInstallmentsBlocked = () => {
    // Para LOAN e FIXED (sem preview), quando ativo, não pode desativar
    return (
      (formData.type === 'LOAN' || (formData.type === 'FIXED' && !isPreview)) &&
      hasInstallments
    );
  };

  // Aplicar regras automaticamente quando o tipo mudar
  useEffect(() => {
    // Se for LOAN, desabilitar preview
    if (formData.type === 'LOAN') {
      setIsPreview(false);
    }
    // Se for CREDIT_CARD, desabilitar preview e parcelas
    if (formData.type === 'CREDIT_CARD') {
      setIsPreview(false);
      setHasInstallments(false);
    }
    // Se for DEBIT_CARD, desabilitar preview e parcelas
    if (formData.type === 'DEBIT_CARD') {
      setIsPreview(false);
      setHasInstallments(false);
    }
  }, [formData.type]);

  // Aplicar regras quando preview mudar
  useEffect(() => {
    // Se preview estiver ativo no tipo FIXED, desabilitar parcelas
    if (formData.type === 'FIXED' && isPreview) {
      setHasInstallments(false);
      // Limpar valor da parcela quando desabilitar parcelas
      setParceledInstallmentValue('');
      setDisplayParceledInstallmentValue('');
    }
    // Se preview estiver desativo no tipo FIXED, forçar parcelas
    else if (formData.type === 'FIXED' && !isPreview) {
      setHasInstallments(true);
    }
  }, [isPreview, formData.type]);

  // Limpar valor da parcela quando hasInstallments mudar para false
  useEffect(() => {
    if (!hasInstallments && formData.type !== 'LOAN') {
      setParceledInstallmentValue('');
      setDisplayParceledInstallmentValue('');
    }
  }, [hasInstallments, formData.type]);

  // Recalcular totalAmount quando número de parcelas mudar (se já tiver valor da parcela)
  useEffect(() => {
    if (
      hasInstallments &&
      formData.type !== 'LOAN' &&
      parceledInstallmentValue
    ) {
      const valueInCents =
        parseInt(parceledInstallmentValue.replace(/\D/g, '')) || 0;
      const installmentsCount = formData.installments || 1;
      const totalAmount = valueInCents * installmentsCount;
      setFormData((prev) => ({ ...prev, totalAmount }));
    }
  }, [
    formData.installments,
    hasInstallments,
    formData.type,
    parceledInstallmentValue,
  ]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<CreateContaPayload, 'userId'>, string>>
  >({});

  const [displayValue, setDisplayValue] = useState<string>(
    initialData?.totalAmount ? formatCurrency(initialData.totalAmount) : ''
  );
  const [displayParceledInstallmentValue, setDisplayParceledInstallmentValue] =
    useState<string>('');
  const [displayCreditLimit, setDisplayCreditLimit] = useState<string>(
    initialData?.creditLimit ? formatCurrency(initialData.creditLimit) : ''
  );

  // Opções para o select de tipo de conta
  const tipoContaOptions = useCustomOptions(
    accountTypes?.map((type) => ({
      value: type.value,
      label: type.label,
    })) || []
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

    // Se usuário editar manualmente o total, desligar a sincronização do helper
    if (calcSyncEnabled) {
      setCalcSyncEnabled(false);
    }
  };

  const handleInstallmentValueChange = (inputValue: string) => {
    const numbersOnly = inputValue.replace(/\D/g, '');

    if (numbersOnly === '') {
      setInstallmentValue('');
      return;
    }

    const valueInCents = parseInt(numbersOnly);
    const valueInReais = valueInCents / 100;

    setInstallmentValue(formatCurrency(valueInReais));
  };

  const handleParceledInstallmentValueChange = (inputValue: string) => {
    const numbersOnly = inputValue.replace(/\D/g, '');

    if (numbersOnly === '') {
      setParceledInstallmentValue('');
      setDisplayParceledInstallmentValue('');
      setFormData((prev) => ({ ...prev, totalAmount: 0 }));
      return;
    }

    const valueInCents = parseInt(numbersOnly);
    const valueInReais = valueInCents / 100;

    setParceledInstallmentValue(formatCurrency(valueInReais));
    setDisplayParceledInstallmentValue(formatCurrency(valueInReais));

    // Calcular totalAmount automaticamente: valor da parcela * número de parcelas
    const installmentsCount = formData.installments || 1;
    const totalAmount = valueInCents * installmentsCount;
    setFormData((prev) => ({ ...prev, totalAmount }));
  };

  // Helper: mudança do valor por parcela (currency)
  const handleCalcInstallmentValueChange = (inputValue: string) => {
    const numbersOnly = inputValue.replace(/\D/g, '');
    if (numbersOnly === '') {
      setCalcInstallmentValue('');
      if (calcSyncEnabled) {
        setFormData((prev) => ({ ...prev, totalAmount: 0 }));
      }
      return;
    }
    const valueInCents = parseInt(numbersOnly);
    const valueInReais = valueInCents / 100;
    setCalcInstallmentValue(formatCurrency(valueInReais));

    if (calcSyncEnabled) {
      const installmentsCount = formData.installments || 1;
      setFormData((prev) => ({
        ...prev,
        totalAmount: valueInCents * installmentsCount,
      }));
      setDisplayValue(formatCurrency(valueInReais * installmentsCount));
    }
  };

  const handleTypeChange = (newType: CreateContaPayload['type']) => {
    setFormData((prev) => ({ ...prev, type: newType }));

    if (newType === 'LOAN') {
      setHasInstallments(true);
      setFormData((prev) => ({ ...prev, installments: 1 }));
    } else {
      setInstallmentValue('');
    }

    // Limpar valor da parcela quando tipo mudar
    setParceledInstallmentValue('');
    setDisplayParceledInstallmentValue('');

    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<
      Record<keyof Omit<CreateContaPayload, 'userId'>, string>
    > = {};

    if (!formData.name.trim()) {
      newErrors.name = tCommon('validation.nameRequired');
    }

    // Valor Total é obrigatório apenas se for LOAN ou não for parcelado (exceto cartão de crédito)
    if (
      (formData.type === 'LOAN' || !hasInstallments) &&
      formData.type !== 'CREDIT_CARD' &&
      formData.totalAmount <= 0
    ) {
      newErrors.totalAmount = tCommon('validation.totalAmountRequired');
    }

    // Valor da parcela é obrigatório se for parcelado e não for LOAN
    if (
      hasInstallments &&
      formData.type !== 'LOAN' &&
      formData.type !== 'CREDIT_CARD' &&
      formData.type !== 'DEBIT_CARD' &&
      (!parceledInstallmentValue ||
        parseInt(parceledInstallmentValue.replace(/\D/g, '')) <= 0)
    ) {
      newErrors.totalAmount =
        t('installmentAmountRequired') ||
        tCommon('validation.totalAmountRequired');
    }

    if (formData.type === 'CREDIT_CARD') {
      if (!formData.creditLimit || formData.creditLimit <= 0) {
        (newErrors as any).creditLimit =
          t('creditLimitRequired') || 'Limite de crédito é obrigatório';
      }
      if (
        !formData.closingDate ||
        formData.closingDate < 1 ||
        formData.closingDate > 31
      ) {
        (newErrors as any).closingDate =
          t('closingDateRequired') || 'Dia de fechamento inválido';
      }
    }

    // Para contas FIXED sem preview, sempre deve ter parcelas
    if (
      formData.type === 'FIXED' &&
      !isPreview &&
      (formData.installments || 0) < 1
    ) {
      newErrors.installments = tCommon('validation.installmentsRequired');
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
      let dataToSubmit: Omit<CreateContaPayload, 'userId'>;

      if (formData.type === 'LOAN') {
        // Para empréstimos, incluir valor da parcela e sempre desabilitar preview
        const installmentValueInCents = installmentValue
          ? parseInt(installmentValue.replace(/\D/g, ''))
          : 0;

        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: formData.totalAmount,
          installments: formData.installments,
          installmentAmount: installmentValueInCents,
          isPreview: false, // Sempre false para LOAN
          startDate: formData.startDate,
          dueDay: formData.dueDay,
        };
      } else if (formData.type === 'FIXED') {
        // Para contas FIXED, usar o valor do isPreview
        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: formData.totalAmount,
          installments: hasInstallments ? formData.installments : undefined,
          isPreview: isPreview,
          startDate: formData.startDate,
          dueDay: formData.dueDay,
        };
      } else if (formData.type === 'CREDIT_CARD') {
        // Para cartão de crédito
        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: 0, // Cartão de crédito não tem valor total
          isPreview: false, // Sempre false para CREDIT_CARD
          startDate: formData.startDate,
          dueDay: formData.dueDay,
          creditLimit: formData.creditLimit,
          closingDate: formData.closingDate,
        };
      } else if (formData.type === 'DEBIT_CARD') {
        // Para cartão de débito
        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: formData.totalAmount,
          isPreview: false, // Sempre false para DEBIT_CARD
          startDate: formData.startDate,
          dueDay: formData.dueDay,
        };
      } else if (hasInstallments) {
        // Para outros tipos com parcelas
        dataToSubmit = {
          ...formData,
          isPreview: isPreview,
        };
      } else {
        // Para contas sem parcelas
        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: formData.totalAmount,
          isPreview: isPreview,
          startDate: formData.startDate,
          dueDay: formData.dueDay,
        };
      }

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
      {/* Toggles no topo */}
      <div className="flex flex-col gap-4 py-4 border-b border-gray-200">
        <BaseToggleSwitch
          data-tour-id="toggle-parcelas"
          checked={hasInstallments}
          onChange={setHasInstallments}
          label={tCommon('hasInstallments')}
          disabled={isInstallmentsDisabled() || isInstallmentsBlocked()}
        />
        <BaseToggleSwitch
          data-tour-id="toggle-preview"
          checked={isPreview}
          onChange={setIsPreview}
          label={t('isPreview')}
          disabled={isPreviewDisabled()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            data-tour-id="field-nome"
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
            data-tour-id="field-tipo"
            value={formData.type}
            onChange={(value) =>
              handleTypeChange(value as CreateContaPayload['type'])
            }
            options={tipoContaOptions}
            error={errors.type}
            size="lg"
          />
        </div>

        {(formData.type === 'LOAN' || !hasInstallments) &&
          formData.type !== 'CREDIT_CARD' && (
            <div data-tour-id="field-valor-total">
              <div className="flex items-center justify-between">
                <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                  {t('totalAmount')} <span className="text-red-500">*</span>
                </BaseLabel>
                {hasInstallments && formData.type === 'FIXED' && (
                  <button
                    type="button"
                    onClick={() => setShowCalcModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {t('calcByInstallment')}
                  </button>
                )}
              </div>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalAmount}
                </p>
              )}

              <BaseModal
                isOpen={showCalcModal}
                onClose={() => setShowCalcModal(false)}
                title={t('calcByInstallment')}
                size="lg"
              >
                <div className="p-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <BaseLabel className="block text-xs font-medium text-gray-700 mb-1">
                        {t('installmentAmount')}
                      </BaseLabel>
                      <BaseInput
                        type="text"
                        value={calcInstallmentValue}
                        onChange={(e) =>
                          handleCalcInstallmentValueChange(e.target.value)
                        }
                        placeholder={tCommon('placeholders.currency')}
                        className="w-full h-10 text-sm"
                      />
                    </div>
                    <div>
                      <BaseLabel className="block text-xs font-medium text-gray-700 mb-1">
                        {t('installments')}
                      </BaseLabel>
                      <BaseInput
                        type="number"
                        value={(formData.installments || 1).toString()}
                        onChange={(e) => {
                          const count = parseInt(e.target.value) || 1;
                          handleInputChange('installments', count);
                          if (calcSyncEnabled) {
                            const cents =
                              parseInt(
                                (calcInstallmentValue || '').replace(/\D/g, '')
                              ) || 0;
                            setFormData((prev) => ({
                              ...prev,
                              totalAmount: cents * count,
                            }));
                            setDisplayValue(
                              formatCurrency((cents / 100) * count)
                            );
                          }
                        }}
                        min="1"
                        className="w-full h-10 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="inline-flex items-center space-x-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={calcSyncEnabled}
                          onChange={(e) => setCalcSyncEnabled(e.target.checked)}
                        />
                        <span>{t('keepSynced')}</span>
                      </label>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {t('calculatedTotal')}:{' '}
                    <strong>{displayValue || formatCurrency(0)}</strong>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <BaseButton
                      type="button"
                      variant="secondary"
                      onClick={() => setShowCalcModal(false)}
                    >
                      {t('cancel')}
                    </BaseButton>
                    <BaseButton
                      type="button"
                      variant="primary"
                      onClick={() => {
                        const cents =
                          parseInt(
                            (calcInstallmentValue || '').replace(/\D/g, '')
                          ) || 0;
                        const count = formData.installments || 1;
                        const total = cents * count;
                        setFormData((prev) => ({
                          ...prev,
                          totalAmount: total,
                        }));
                        setDisplayValue(formatCurrency(total / 100));
                        setShowCalcModal(false);
                      }}
                    >
                      {t('useThisTotal')}
                    </BaseButton>
                  </div>
                </div>
              </BaseModal>
            </div>
          )}

        {formData.type === 'CREDIT_CARD' && (
          <>
            <div>
              <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                {t('creditLimit') || 'Limite de Crédito'}{' '}
                <span className="text-red-500">*</span>
              </BaseLabel>
              <BaseInput
                type="text"
                value={displayCreditLimit}
                onChange={(e) => {
                  const numbersOnly = e.target.value.replace(/\D/g, '');
                  if (numbersOnly === '') {
                    setDisplayCreditLimit('');
                    setFormData((prev) => ({ ...prev, creditLimit: 0 }));
                    return;
                  }
                  const valueInCents = parseInt(numbersOnly);
                  const valueInReais = valueInCents / 100;
                  setDisplayCreditLimit(formatCurrency(valueInReais));
                  setFormData((prev) => ({
                    ...prev,
                    creditLimit: valueInCents,
                  }));
                }}
                placeholder={tCommon('placeholders.currency')}
                className={`w-full h-12 text-base ${
                  (errors as any).creditLimit ? 'border-red-500' : ''
                }`}
              />
              {(errors as any).creditLimit && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors as any).creditLimit}
                </p>
              )}
            </div>
            <div>
              <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                {t('closingDate') || 'Dia de Fechamento'}{' '}
                <span className="text-red-500">*</span>
              </BaseLabel>
              <BaseInput
                type="number"
                value={formData.closingDate?.toString() || ''}
                onChange={(e) =>
                  handleInputChange(
                    'closingDate',
                    parseInt(e.target.value) || 1
                  )
                }
                placeholder="1"
                min="1"
                max="31"
                className={`w-full h-12 text-base ${
                  (errors as any).closingDate ? 'border-red-500' : ''
                }`}
              />
              {(errors as any).closingDate && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors as any).closingDate}
                </p>
              )}
            </div>
          </>
        )}

        {formData.type === 'LOAN' && (
          <div>
            <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
              {t('installmentAmount')} <span className="text-red-500">*</span>
            </BaseLabel>
            <BaseInput
              type="text"
              value={installmentValue}
              onChange={(e) => handleInstallmentValueChange(e.target.value)}
              placeholder={tCommon('placeholders.currency')}
              className="w-full h-12 text-base"
            />
          </div>
        )}

        {hasInstallments &&
          formData.type !== 'CREDIT_CARD' &&
          formData.type !== 'DEBIT_CARD' &&
          formData.type !== 'LOAN' && (
            <div data-tour-id="field-valor-parcela">
              <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                {t('installmentAmount')} <span className="text-red-500">*</span>
              </BaseLabel>
              <BaseInput
                type="text"
                value={displayParceledInstallmentValue}
                onChange={(e) =>
                  handleParceledInstallmentValueChange(e.target.value)
                }
                placeholder={tCommon('placeholders.currency')}
                className={`w-full h-12 text-base ${
                  errors.totalAmount ? 'border-red-500' : ''
                }`}
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalAmount}
                </p>
              )}
            </div>
          )}

        {hasInstallments && formData.type !== 'CREDIT_CARD' && formData.type !== 'DEBIT_CARD' && (
          <div data-tour-id="field-parcelas">
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

        <div data-tour-id="field-data-inicio">
          <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
            {t('startDate')} <span className="text-red-500">*</span>
          </BaseLabel>
          <BaseInput
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            disabled={isStartDateFixed}
            className={`w-full h-12 text-base ${
              errors.startDate ? 'border-red-500' : ''
            } ${isStartDateFixed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div data-tour-id="field-vencimento">
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

      <div
        className="flex justify-end space-x-4 pt-6 border-t border-gray-200"
        data-tour-id="modal-actions"
      >
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
