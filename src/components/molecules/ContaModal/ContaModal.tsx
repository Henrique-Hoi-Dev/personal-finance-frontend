'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseModal } from '@/components/atoms';
import { ContaForm } from '@/components/molecules';
import { CreateContaPayload } from '@/types/contas';

interface ContaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateContaPayload, 'userId'>) => Promise<void>;
  loading?: boolean;
  referenceMonth?: number;
  referenceYear?: number;
}

export function ContaModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  referenceMonth,
  referenceYear,
}: ContaModalProps) {
  const t = useTranslations('Contas');

  const handleSubmit = async (data: Omit<CreateContaPayload, 'userId'>) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('addAccount')}
      size="2xl"
      titleProps={
        {
          'data-tour-id': 'modal-title',
        } as React.HTMLAttributes<HTMLHeadingElement>
      }
    >
      <div className="p-6">
        <ContaForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
          hideReferenceFields={Boolean(referenceMonth && referenceYear)}
          initialData={{
            referenceMonth: referenceMonth,
            referenceYear: referenceYear,
          }}
        />
      </div>
    </BaseModal>
  );
}
