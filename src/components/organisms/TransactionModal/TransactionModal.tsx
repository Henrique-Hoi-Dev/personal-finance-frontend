import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseModal } from '@/components/atoms';
import { TransactionForm, TransactionFormData } from '@/components/molecules';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </BaseModal>
  );
};
