import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BaseButton,
  BaseInput,
  BaseLabel,
  BaseToggleSwitch,
} from '@/components/atoms';
import { formatCurrency, formatCurrencyFromCents } from '@/utils';
import { UpdateContaPayload, CreateContaPayload } from '@/types/contas';
import { LinkedAccountForm } from '@/components/molecules';
import {
  createConta,
  associateAccountToCreditCard,
} from '@/services/contas.service';
import { toast } from 'sonner';

type ViewMode = 'edit' | 'create';

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
    type?: string;
    creditLimit?: number;
    closingDate?: number;
    id?: string;
  };
  creditCardId?: string;
  referenceMonth?: number;
  referenceYear?: number;
  onAccountLinked?: () => void;
}

export function ContaEditForm({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  creditCardId,
  referenceMonth,
  referenceYear,
  onAccountLinked,
}: ContaEditFormProps) {
  const t = useTranslations('Contas');
  const tCommon = useTranslations('Common');

  const isCreditCard = initialData.type === 'CREDIT_CARD';
  const [currentView, setCurrentView] = useState<ViewMode>('edit');
  const [isCreatingLinkedAccount, setIsCreatingLinkedAccount] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData.name,
    totalAmount: initialData.totalAmount,
    startDate: initialData.startDate,
    dueDay: initialData.dueDay,
    creditLimit: initialData.creditLimit || 0,
    closingDate: initialData.closingDate || 1,
  });

  const [isPreview, setIsPreview] = useState(initialData.isPreview || false);
  const [displayValue, setDisplayValue] = useState<string>(
    formatCurrencyFromCents(initialData.totalAmount)
  );
  const [displayCreditLimit, setDisplayCreditLimit] = useState<string>(
    initialData.creditLimit
      ? formatCurrencyFromCents(initialData.creditLimit)
      : ''
  );

  const [errors, setErrors] = useState<{
    name?: string;
    totalAmount?: string;
    startDate?: string;
    dueDay?: string;
    creditLimit?: string;
    closingDate?: string;
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
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field as keyof typeof errors]: undefined,
      }));
    }
  };

  const handleCreditLimitChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly === '') {
      setDisplayCreditLimit('');
      setFormData((prev) => ({ ...prev, creditLimit: 0 }));
      return;
    }
    const valueInCents = parseInt(numbersOnly);
    const valueInReais = valueInCents / 100;
    setDisplayCreditLimit(formatCurrencyFromCents(valueInCents));
    setFormData((prev) => ({ ...prev, creditLimit: valueInCents }));

    if (errors.creditLimit) {
      setErrors((prev) => ({ ...prev, creditLimit: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = tCommon('validation.nameRequired');
    }

    if (!isCreditCard && formData.totalAmount <= 0) {
      newErrors.totalAmount = tCommon('validation.totalAmountRequired');
    }

    if (isCreditCard) {
      if (!formData.creditLimit || formData.creditLimit <= 0) {
        newErrors.creditLimit =
          t('creditLimitRequired') || 'Limite de crédito é obrigatório';
      }
      if (
        !formData.closingDate ||
        formData.closingDate < 1 ||
        formData.closingDate > 31
      ) {
        newErrors.closingDate =
          t('closingDateRequired') || 'Dia de fechamento inválido';
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
      const submitData: Omit<UpdateContaPayload, 'id'> = {
        name: formData.name,
        startDate: formData.startDate,
        dueDay: formData.dueDay,
        isPreview: isCreditCard ? false : isPreview,
      };

      if (isCreditCard) {
        submitData.creditLimit = formData.creditLimit;
        submitData.closingDate = formData.closingDate;
      } else {
        submitData.totalAmount = formData.totalAmount;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
    }
  };

  const handleCreateLinkedAccount = async (
    data: Omit<CreateContaPayload, 'userId' | 'type'>
  ) => {
    if (!creditCardId || !initialData.id) {
      toast.error('Erro: ID do cartão de crédito não encontrado');
      return;
    }

    setIsCreatingLinkedAccount(true);
    try {
      // Criar conta FIXED
      const { useAuthStore } = await import('@/store/auth.store');
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const contaData: CreateContaPayload = {
        ...data,
        type: 'FIXED',
        userId: user.id,
      };

      const novaConta = await createConta(contaData);

      // Associar conta ao cartão de crédito
      await associateAccountToCreditCard(
        creditCardId || initialData.id,
        novaConta.id
      );

      toast.success(
        t('accountLinkedSuccess') || 'Conta criada e vinculada com sucesso!'
      );

      // Callback para recarregar dados se necessário
      if (onAccountLinked) {
        onAccountLinked();
      }

      // Fechar o modal completamente
      onCancel();
    } catch (error: any) {
      console.error('Erro ao criar e vincular conta:', error);
      toast.error(
        error.message || 'Erro ao criar e vincular conta. Tente novamente.'
      );
    } finally {
      setIsCreatingLinkedAccount(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Container com transição */}
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(${currentView === 'edit' ? '0%' : '-100%'})`,
        }}
      >
        {/* View de Edição */}
        <div className="w-full flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle Preview */}
            {!isCreditCard && (
              <div className="flex justify-start py-4 border-b border-gray-200">
                <BaseToggleSwitch
                  checked={isPreview}
                  onChange={setIsPreview}
                  label={t('isPreview')}
                />
              </div>
            )}

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
              {/* Valor Total - apenas se não for cartão de crédito */}
              {!isCreditCard && (
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalAmount}
                    </p>
                  )}
                </div>
              )}

              {/* Campos de Cartão de Crédito */}
              {isCreditCard && (
                <>
                  <div>
                    <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                      {t('creditLimit') || 'Limite de Crédito'}{' '}
                      <span className="text-red-500">*</span>
                    </BaseLabel>
                    <BaseInput
                      type="text"
                      value={displayCreditLimit}
                      onChange={(e) => handleCreditLimitChange(e.target.value)}
                      placeholder={tCommon('placeholders.currency')}
                      className={`w-full h-12 text-base ${
                        errors.creditLimit ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.creditLimit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.creditLimit}
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
                        errors.closingDate ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.closingDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.closingDate}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Coluna Direita: Data de Início (se não for cartão de crédito) ou Dia de Vencimento + Botão */}
              {isCreditCard && currentView === 'edit' ? (
                /* Dia de Vencimento e Botão Adicionar Conta na coluna direita */
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
                  <BaseButton
                    type="button"
                    onClick={() => setCurrentView('create')}
                    className="w-full h-12 px-4 mt-3 mb-16 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    size="md"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {t('addLinkedAccount') || 'Adicionar Conta'}
                  </BaseButton>
                </div>
              ) : (
                /* Data de Início e Dia de Vencimento para outros tipos */
                <>
                  <div>
                    <BaseLabel className="block text-sm font-medium text-gray-700 mb-2">
                      {t('startDate')} <span className="text-red-500">*</span>
                    </BaseLabel>
                    <BaseInput
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange('startDate', e.target.value)
                      }
                      className={`w-full h-12 text-base ${
                        errors.startDate ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startDate}
                      </p>
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
                        handleInputChange(
                          'dueDay',
                          parseInt(e.target.value) || 1
                        )
                      }
                      placeholder="1"
                      min="1"
                      max="31"
                      className={`w-full h-12 text-base ${
                        errors.dueDay ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.dueDay && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dueDay}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 bg-white">
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
        </div>

        {/* View de Criar Conta Vinculada */}
        {isCreditCard && (
          <div className="w-full flex-shrink-0">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentView('edit')}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t('backToEdit') || 'Voltar para Edição'}
              </button>
            </div>
            <LinkedAccountForm
              onSubmit={handleCreateLinkedAccount}
              onCancel={() => setCurrentView('edit')}
              loading={isCreatingLinkedAccount}
              creditCardId={creditCardId || initialData.id || ''}
              creditCardDueDay={formData.dueDay}
            />
          </div>
        )}
      </div>
    </div>
  );
}
