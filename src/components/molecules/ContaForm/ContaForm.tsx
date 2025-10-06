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
  hideReferenceFields?: boolean;
}

export function ContaForm({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  hideReferenceFields = false,
}: ContaFormProps) {
  const t = useTranslations('Contas');
  const tCommon = useTranslations('Common');
  const [formData, setFormData] = useState<Omit<CreateContaPayload, 'userId'>>({
    name: initialData?.name || '',
    type: initialData?.type || 'FIXED',
    totalAmount: initialData?.totalAmount || 0,
    installments: initialData?.installments || 1,
    startDate: initialData?.startDate || '',
    dueDay: initialData?.dueDay || 1,
    referenceMonth: initialData?.referenceMonth || new Date().getMonth() + 1,
    referenceYear: initialData?.referenceYear || new Date().getFullYear(),
  });

  const [hasInstallments, setHasInstallments] = useState(
    initialData?.installments ? initialData.installments > 1 : false
  );
  const [installmentValue, setInstallmentValue] = useState<string>('');
  const [isPreview, setIsPreview] = useState(initialData?.isPreview || false);

  // Helper de cálculo por parcela (UX apenas)
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcSyncEnabled, setCalcSyncEnabled] = useState(true);
  const [calcInstallmentValue, setCalcInstallmentValue] = useState<string>('');

  // Função para verificar se preview deve estar desabilitado
  const isPreviewDisabled = () => {
    return formData.type === 'LOAN' || formData.type === 'FIXED';
  };

  // Função para verificar se parcelamento deve estar forçado
  const isInstallmentsForced = () => {
    return formData.type === 'FIXED';
  };

  // Função para verificar se parcelamento deve estar desabilitado
  const isInstallmentsDisabled = () => {
    const disabled = formData.type === 'FIXED_PREVIEW';
    return disabled;
  };

  // Função para verificar se parcelamento deve estar bloqueado (não pode desativar)
  const isInstallmentsBlocked = () => {
    // Para LOAN e FIXED, quando ativo, não pode desativar
    return (
      (formData.type === 'LOAN' || formData.type === 'FIXED') && hasInstallments
    );
  };

  // Aplicar regras automaticamente quando o tipo mudar
  useEffect(() => {
    // Se for FIXED, forçar parcelamento e desabilitar preview
    if (formData.type === 'FIXED') {
      setHasInstallments(true);
      setIsPreview(false);
    }
    // Se for LOAN, desabilitar preview e parcelamento
    else if (formData.type === 'LOAN') {
      setIsPreview(false);
    }
    // Se for FIXED_PREVIEW, habilitar preview e desabilitar parcelamento
    else if (formData.type === 'FIXED_PREVIEW') {
      setIsPreview(true);
      setHasInstallments(false);
    }
  }, [formData.type]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<CreateContaPayload, 'userId'>, string>>
  >({});

  const [displayValue, setDisplayValue] = useState<string>(
    initialData?.totalAmount ? formatCurrency(initialData.totalAmount) : ''
  );

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

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = tCommon('validation.totalAmountRequired');
    }

    // Para contas FIXED (não FIXED_PREVIEW), sempre deve ter parcelas
    if (formData.type === 'FIXED' && (formData.installments || 0) < 1) {
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
          referenceMonth: formData.referenceMonth,
          referenceYear: formData.referenceYear,
        };
      } else if (formData.type === 'FIXED') {
        // Para contas FIXED, sempre parcelado e sem preview
        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: formData.totalAmount,
          installments: formData.installments,
          isPreview: false, // Sempre false para FIXED
          startDate: formData.startDate,
          dueDay: formData.dueDay,
          referenceMonth: formData.referenceMonth,
          referenceYear: formData.referenceYear,
        };
      } else if (formData.type === 'FIXED_PREVIEW') {
        // Para contas FIXED_PREVIEW, parcelamento opcional e sempre com preview
        dataToSubmit = {
          name: formData.name,
          type: formData.type,
          totalAmount: formData.totalAmount,
          installments: hasInstallments ? formData.installments : undefined,
          isPreview: true, // Sempre true para FIXED_PREVIEW
          startDate: formData.startDate,
          dueDay: formData.dueDay,
          referenceMonth: formData.referenceMonth,
          referenceYear: formData.referenceYear,
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
          referenceMonth: formData.referenceMonth,
          referenceYear: formData.referenceYear,
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
          checked={hasInstallments}
          onChange={setHasInstallments}
          label={tCommon('hasInstallments')}
          disabled={isInstallmentsDisabled() || isInstallmentsBlocked()}
        />
        <BaseToggleSwitch
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
              handleTypeChange(value as CreateContaPayload['type'])
            }
            options={tipoContaOptions}
            error={errors.type}
            size="lg"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
              {t('totalAmount')} <span className="text-red-500">*</span>
            </BaseLabel>
            {hasInstallments &&
              (formData.type === 'FIXED' ||
                formData.type === 'FIXED_PREVIEW') && (
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
            <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>
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
                        setDisplayValue(formatCurrency((cents / 100) * count));
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
                    setFormData((prev) => ({ ...prev, totalAmount: total }));
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

        {!hideReferenceFields && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                Referência Mes e <span className="text-red-500">*</span>
              </BaseLabel>
              <BaseInput
                type="number"
                value={formData.referenceMonth?.toString() || ''}
                onChange={(e) =>
                  handleInputChange(
                    'referenceMonth',
                    parseInt(e.target.value) || 1
                  )
                }
                placeholder="1"
                min="1"
                max="12"
                className={`w-full h-12 text-base ${
                  errors.referenceMonth ? 'border-red-500' : ''
                }`}
              />
              {errors.referenceMonth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.referenceMonth}
                </p>
              )}
            </div>
            <div>
              <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                Ano <span className="text-red-500">*</span>
              </BaseLabel>
              <BaseInput
                type="number"
                value={formData.referenceYear?.toString() || ''}
                onChange={(e) =>
                  handleInputChange(
                    'referenceYear',
                    parseInt(e.target.value) || new Date().getFullYear()
                  )
                }
                placeholder={new Date().getFullYear().toString()}
                min="2020"
                max="2030"
                className={`w-full h-12 text-base ${
                  errors.referenceYear ? 'border-red-500' : ''
                }`}
              />
              {errors.referenceYear && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.referenceYear}
                </p>
              )}
            </div>
          </div>
        )}

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
