import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Conta } from '@/types';
import {
  payInstallment,
  payFullAccount,
  deleteInstallment,
} from '@/services/contas.service';
import { BaseConfirmModal } from '@/components/atoms';
import { toast } from 'sonner';
import {
  formatCurrencyFromCents,
  getAmountColor,
  getAccountTypeLabel,
} from '@/utils';

interface ContaDetailsProps {
  conta: Conta | null;
  onClose?: () => void;
  onUpdateConta?: (updatedConta: Conta) => void;
}

export const ContaDetails: React.FC<ContaDetailsProps> = ({
  conta,
  onClose,
  onUpdateConta,
}) => {
  const t = useTranslations('Contas');
  const [payingInstallments, setPayingInstallments] = useState<Set<string>>(
    new Set()
  );
  const [payingFullAccount, setPayingFullAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePayInstallment = async (installmentId: string) => {
    try {
      setPayingInstallments((prev) => new Set(prev).add(installmentId));

      const installment = conta?.installmentList?.find(
        (inst) => inst.id === installmentId
      );
      if (!installment) return;

      await payInstallment(installmentId, installment.amount);

      // Atualizar apenas o selectedAccount local
      if (conta && onUpdateConta) {
        const updatedConta = {
          ...conta,
          installmentList: conta.installmentList?.map((inst) =>
            inst.id === installmentId
              ? {
                  ...inst,
                  isPaid: true,
                  paidAt: new Date().toISOString(),
                }
              : inst
          ),
        };
        onUpdateConta(updatedConta);
      }

      toast.success('Parcela paga com sucesso');
    } catch (error) {
      toast.error('Erro ao pagar parcela');
    } finally {
      setPayingInstallments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(installmentId);
        return newSet;
      });
    }
  };

  const handlePayFullAccount = async () => {
    try {
      setPayingFullAccount(true);

      let totalAmount = 0;

      if (hasInstallments) {
        const pendingInstallments =
          conta?.installmentList?.filter((inst) => !inst.isPaid) || [];
        totalAmount = pendingInstallments.reduce(
          (sum, inst) => sum + inst.amount,
          0
        );
      } else {
        totalAmount = conta?.totalAmount || 0;
      }

      if (conta?.id) {
        await payFullAccount(conta.id, totalAmount);

        if (onUpdateConta) {
          let updatedConta: Conta;

          if (hasInstallments) {
            updatedConta = {
              ...conta,
              installmentList: conta.installmentList?.map((installment) => ({
                ...installment,
                isPaid: true,
                paidAt: new Date().toISOString(),
              })),
            };
          } else {
            updatedConta = {
              ...conta,
              isPaid: true,
            };
          }

          onUpdateConta(updatedConta);
        }

        toast.success('Conta paga com sucesso');
      }
    } catch (error) {
      toast.error('Erro ao pagar conta toda');
    } finally {
      setPayingFullAccount(false);
    }
  };

  const handleDeleteInstallmentClick = (installmentId: string) => {
    setInstallmentToDelete(installmentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteInstallment = async () => {
    if (!installmentToDelete || !conta) return;

    setIsDeleting(true);
    try {
      await deleteInstallment(installmentToDelete);

      // Atualiza a conta removendo a parcela excluída
      if (onUpdateConta) {
        const updatedConta = {
          ...conta,
          installmentList: conta.installmentList?.filter(
            (inst) => inst.id !== installmentToDelete
          ),
        };
        onUpdateConta(updatedConta);
      }

      toast.success('Parcela excluída com sucesso');
      setShowDeleteModal(false);
      setInstallmentToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir parcela');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeleteInstallment = () => {
    setShowDeleteModal(false);
    setInstallmentToDelete(null);
  };

  if (!conta) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center">
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {t('selectAccount')}
        </h3>
        <p className="text-gray-500 text-base">
          {t('selectAccountDescription')}
        </p>
      </div>
    );
  }

  const hasInstallments =
    conta.installmentList && conta.installmentList.length > 0;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{conta.name}</h2>
          <p className="text-sm text-gray-500">
            {getAccountTypeLabel(conta.type)}
          </p>
        </div>
      </div>

      {/* Saldo da Conta */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">{t('accountBalance')}</p>
          <p
            className={`text-4xl font-bold ${getAmountColor(
              conta.totalAmount
            )}`}
          >
            {formatCurrencyFromCents(conta.totalAmount)}
          </p>
        </div>
      </div>

      {/* Grid de informações de juros - só para empréstimos */}
      {conta.type === 'LOAN' &&
        (conta.totalWithInterest ||
          conta.interestRate ||
          conta.monthlyInterestRate ||
          conta.amountPaid) && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-3">
                {t('loanInformation')}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">{t('totalWithInterest')}</p>
                    <p className="font-semibold text-green-600">
                      {conta.totalWithInterest
                        ? formatCurrencyFromCents(conta.totalWithInterest)
                        : 'R$ 0,00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">{t('interestAmount')}</p>
                    <p className="font-semibold text-red-600">
                      {conta.interestRate
                        ? formatCurrencyFromCents(conta.interestRate)
                        : 'R$ 0,00'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">{t('amountPaid')}</p>
                    <p className="font-semibold text-emerald-600">
                      {conta.amountPaid
                        ? formatCurrencyFromCents(conta.amountPaid)
                        : 'R$ 0,00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">{t('monthlyInterestRate')}</p>
                    <p className="font-semibold text-blue-600">
                      {conta.monthlyInterestRate
                        ? `${conta.monthlyInterestRate.toFixed(2)}%`
                        : '0,00%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {hasInstallments && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('installmentsSection')}
            </h3>
            {conta.installmentList?.some((inst) => !inst.isPaid) && (
              <button
                onClick={handlePayFullAccount}
                disabled={payingFullAccount}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  payingFullAccount
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {payingFullAccount ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('payingFull')}
                  </div>
                ) : (
                  t('payFull')
                )}
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {conta.installmentList?.map((installment) => (
              <div
                key={installment.id}
                className={`p-4 rounded-lg border ${
                  installment.isPaid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {t('installment')} {installment.number}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('dueDate')}:{' '}
                      {new Date(installment.dueDate).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrencyFromCents(installment.amount)}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {/* Ícone de lixeira - só aparece se a parcela não estiver paga */}
                    {!installment.isPaid && (
                      <button
                        onClick={() =>
                          handleDeleteInstallmentClick(installment.id)
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title={t('deleteInstallmentTooltip')}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Botão de pagar */}
                    {installment.isPaid ? (
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium cursor-not-allowed">
                        {t('paid')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePayInstallment(installment.id)}
                        disabled={payingInstallments.has(installment.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          payingInstallments.has(installment.id)
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {payingInstallments.has(installment.id) ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            {t('paying')}
                          </div>
                        ) : (
                          t('pay')
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasInstallments && (
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">{t('accountType')}</span>
            <span className="text-sm font-medium text-gray-900">
              {getAccountTypeLabel(conta.type)}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              {t('accountStartDate')}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(conta.startDate).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">{t('accountDueDay')}</span>
            <span className="text-sm font-medium text-gray-900">
              {conta.dueDay}
            </span>
          </div>

          {/* Status Preview - só aparece se isPreview for true */}
          {conta.isPreview && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">{t('status')}</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {t('previewStatus')}
              </span>
            </div>
          )}
          {/* Status da conta sem parcelas */}
          <div className="pt-4">
            {!conta.isPaid ? (
              <button
                onClick={handlePayFullAccount}
                disabled={payingFullAccount}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  payingFullAccount
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {payingFullAccount ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('payingFull')}
                  </div>
                ) : (
                  t('payFull')
                )}
              </button>
            ) : (
              <div className="w-full px-4 py-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-green-700 font-medium">
                    {t('paid')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão de Parcela */}
      <BaseConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDeleteInstallment}
        onConfirm={handleConfirmDeleteInstallment}
        title={t('deleteInstallment')}
        message={t('deleteInstallmentMessage')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        type="danger"
        loading={isDeleting}
      />
    </div>
  );
};
