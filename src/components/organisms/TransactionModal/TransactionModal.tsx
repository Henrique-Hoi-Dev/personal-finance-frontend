import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseModal } from '@/components/atoms';
import { TransactionForm, TransactionFormData } from '@/components/molecules';
import { Conta } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contas: Conta[];
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  contas,
  onSubmit,
  loading = false,
}) => {
  const t = useTranslations('Transacoes');

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('addTransaction')}
      size="2xl"
    >
      <TransactionForm
        contas={contas}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </BaseModal>
  );
};
