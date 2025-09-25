import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseModal } from '@/components/atoms';
import { TransactionForm, TransactionFormData } from '@/components/molecules';
import { Conta } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'receita' | 'despesa';
  contas: Conta[];
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  tipo,
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

  const getTitle = () => {
    return tipo === 'receita' ? 'Adicionar Entrada' : 'Adicionar Saída';
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      className="max-w-lg"
    >
      <TransactionForm
        tipo={tipo}
        contas={contas}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </BaseModal>
  );
};
