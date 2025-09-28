import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Conta, CreateContaPayload, UpdateContaPayload } from '@/types';
import { formatCurrencyFromCents, getAmountColor } from '@/utils';
import { useContasStore } from '@/store/contas.store';
import { BaseConfirmModal, BaseModal } from '@/components/atoms';
import { ContaEditForm } from '@/components/molecules';
import { toast } from 'sonner';

interface ContaCardProps {
  conta: Conta;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

export const ContaCard: React.FC<ContaCardProps> = ({
  conta,
  isSelected,
  onClick,
  onDelete,
}) => {
  const t = useTranslations('Contas');
  const { removeConta } = useContasStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const getIconColor = (tipo: string) => {
    if (!tipo) return 'bg-gray-400';

    switch (tipo.toUpperCase()) {
      case 'FIXED':
        return 'bg-blue-500';
      case 'LOAN':
        return 'bg-purple-500';
      case 'CREDIT_CARD':
        return 'bg-purple-400';
      case 'SUBSCRIPTION':
        return 'bg-green-500';
      case 'OTHER':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getIcon = (tipo: string) => {
    if (!tipo) return getDefaultIcon();

    switch (tipo.toUpperCase()) {
      case 'FIXED':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'CREDIT_CARD':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        );
      case 'SUBSCRIPTION':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
      case 'LOAN':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
      case 'OTHER':
        return getDefaultIcon();
      default:
        return getDefaultIcon();
    }
  };

  const getDefaultIcon = () => (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const getTypeLabel = (type: string) => {
    if (!type) return 'Outro';

    switch (type.toUpperCase()) {
      case 'FIXED':
        return 'Corrente';
      case 'LOAN':
        return 'Empréstimo';
      case 'CREDIT_CARD':
        return 'Crédito';
      case 'SUBSCRIPTION':
        return 'Poupança';
      case 'OTHER':
        return 'Outro';
      default:
        return 'Outro';
    }
  };

  const getPendingInstallments = (conta: Conta) => {
    if (conta.installmentList && conta.installmentList.length > 0) {
      const pendingCount = conta.installmentList.filter(
        (inst) => !inst.isPaid
      ).length;
      if (pendingCount > 0) {
        return `${pendingCount} parcelas pendentes`;
      }
    }
    return null;
  };

  const isAccountPaid = (conta: Conta) => {
    if (conta.installmentList && conta.installmentList.length > 0) {
      return conta.installmentList.every((inst) => inst.isPaid);
    } else {
      return conta.isPaid || false;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o clique no card

    if (isAccountPaid(conta)) {
      toast.error('Não é possível excluir uma conta que já foi paga');
      return;
    }

    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await removeConta(conta.id);
      toast.success('Conta excluída com sucesso');
      setShowDeleteModal(false);

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      toast.error('Erro ao excluir conta');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o clique no card
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: Omit<UpdateContaPayload, 'id'>) => {
    try {
      const updateData = {
        id: conta.id,
        totalAmount: data.totalAmount,
        startDate: data.startDate,
        dueDay: data.dueDay,
        isPreview: data.isPreview,
      };

      // Atualizar a conta no store (que já chama o serviço)
      const { updateConta: updateContaInStore } = useContasStore.getState();
      await updateContaInStore(updateData);

      setShowEditModal(false);
      toast.success('Conta atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar conta');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  return (
    <div
      className={`p-4 w-full rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${getIconColor(
              conta.type
            )}`}
          >
            {getIcon(conta.type)}
          </div>
          <div className="flex-1 flex gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{conta.name}</h3>
              <p className="text-sm text-gray-500 font-medium">
                {getTypeLabel(conta.type)}
              </p>
            </div>
            {conta.isPreview && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t('previewStatus')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <p
              className={`font-bold text-xl ${getAmountColor(
                conta.totalAmount
              )}`}
            >
              {formatCurrencyFromCents(conta.totalAmount)}
            </p>
            {isAccountPaid(conta) ? (
              <p className="text-xs text-green-600 mt-1 font-medium">✓ Pago</p>
            ) : getPendingInstallments(conta) ? (
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {getPendingInstallments(conta)}
              </p>
            ) : null}
          </div>

          {!isAccountPaid(conta) && conta.isPreview && (
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title={t('editAccount')}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {/* Ícone de lixeira - só aparece se a conta não estiver paga */}
          {!isAccountPaid(conta) && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title={t('deleteAccountTooltip')}
            >
              <svg
                className="w-5 h-5"
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
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <BaseConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t('deleteAccount')}
        message={t('deleteAccountMessage', { name: conta.name })}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        type="danger"
        loading={isDeleting}
      />

      {/* Modal de Edição */}
      <BaseModal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        title={t('editAccount')}
        size="lg"
      >
        <ContaEditForm
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
          initialData={{
            totalAmount: conta.totalAmount,
            startDate: conta.startDate,
            dueDay: conta.dueDay,
            isPreview: conta.isPreview || false,
          }}
        />
      </BaseModal>
    </div>
  );
};
