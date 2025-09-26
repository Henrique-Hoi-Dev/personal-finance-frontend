import React from 'react';
import { getCategoryLabel, TransactionCategory } from '@/utils';

interface TransactionItemProps {
  description: string;
  category: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  className?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  description,
  category,
  date,
  amount,
  type,
  className = '',
}) => {
  const isIncome = type === 'income';

  const iconBgClass = isIncome ? 'bg-green-100' : 'bg-red-100';
  const textColor = isIncome ? 'text-green-600' : 'text-red-600';

  const icon = isIncome ? (
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
        d="M7 11l5-5m0 0l5 5m-5-5v12"
      />
    </svg>
  ) : (
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
        d="M17 13l-5 5m0 0l-5-5m5 5V6"
      />
    </svg>
  );

  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-900">{description}</p>
          <p className="text-xs text-gray-500">
            {getCategoryLabel(category as TransactionCategory, 'pt')} • {date}
          </p>
        </div>
      </div>
      <div className={`text-sm font-medium ${textColor}`}>
        {isIncome ? '+' : '-'}
        {amount}
      </div>
    </div>
  );
};
