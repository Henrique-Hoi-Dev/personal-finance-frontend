import React from 'react';
import { useTranslations } from 'next-intl';

interface TransactionActionsProps {
  onAddTransaction: () => void;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
  onAddTransaction,
}) => {
  const t = useTranslations('Transacoes');

  return (
    <div className="flex space-x-3">
      <button
        onClick={onAddTransaction}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md whitespace-nowrap w-full sm:w-auto justify-center sm:justify-start"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="hidden sm:inline">{t('addTransaction')}</span>
        <span className="sm:hidden">{t('addTransaction')}</span>
      </button>
    </div>
  );
};
