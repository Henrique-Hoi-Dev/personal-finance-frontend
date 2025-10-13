'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseModal } from '@/components/atoms';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onConfirm?: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
}: SuccessModalProps) {
  const t = useTranslations('Common');

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || t('success')}
      size="md"
    >
      <div className="p-6">
        <div className="text-center">
          {/* Ícone de sucesso */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Mensagem */}
          <p className="text-sm text-gray-500 mb-6">
            {message || t('operationCompleted')}
          </p>

          {/* Botão de confirmação */}
          <div className="flex justify-center">
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              {t('ok')}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
