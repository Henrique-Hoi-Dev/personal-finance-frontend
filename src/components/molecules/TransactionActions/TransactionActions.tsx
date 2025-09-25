import React from 'react';
import { useTranslations } from 'next-intl';

interface TransactionActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
  onAddIncome,
  onAddExpense,
}) => {
  const t = useTranslations('Transacoes');

  return (
    <div className="flex space-x-3">
      <button
        onClick={onAddIncome}
        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>+ {t('addIncome')}</span>
      </button>

      <button
        onClick={onAddExpense}
        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
            d="M20 12H4"
          />
        </svg>
        <span>- {t('addExpense')}</span>
      </button>
    </div>
  );
};
