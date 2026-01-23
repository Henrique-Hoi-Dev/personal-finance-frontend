import React from 'react';
import { useTranslations } from 'next-intl';

interface IncomeCommitmentProps {
  percentage: number;
  totalIncome: number;
  committedAmount: number;
  fixedExpenses: {
    amount: number;
    percentage: number;
  };
  debtPayments: {
    amount: number;
    percentage: number;
  };
}

export const IncomeCommitment: React.FC<IncomeCommitmentProps> = ({
  percentage,
  totalIncome,
  committedAmount,
  fixedExpenses,
  debtPayments,
}) => {
  const t = useTranslations('Dashboard');
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getProgressBarColor = () => {
    if (percentage >= 70) return 'bg-red-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getWarningLevel = () => {
    if (percentage >= 70) return 'Critical';
    if (percentage >= 50) return 'Warning';
    return 'Safe';
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {t('incomeCommitment')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('incomeCommitmentSubtitle')}
          </p>
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {t('attention')}
        </button>
      </div>

      {/* Main Metric */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold text-gray-900">
            {percentage}%
          </span>
          <span className="text-sm text-gray-600">
            {t('fixedExpensesDebtPercentage')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-4 mb-12">
          {/* Markers Labels */}
          <div className="relative w-full mb-2">
            <div className="absolute left-0 text-xs text-gray-600">0%</div>
            <div className="absolute left-[50%] transform -translate-x-1/2 text-xs text-yellow-700 font-medium">
              {t('warning')}
            </div>
            <div className="absolute left-[70%] transform -translate-x-1/2 text-xs text-red-700 font-medium">
              {t('critical')}
            </div>
            <div className="absolute right-0 text-xs text-gray-600">100%</div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-visible">
            {/* Filled Portion */}
            <div
              className={`h-full ${getProgressBarColor()} transition-all duration-300 rounded-full`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />

            {/* Markers Lines */}
            <div className="absolute top-0 left-0 w-full h-6 pointer-events-none">
              <div className="absolute left-0 w-px h-full bg-gray-400" />
              <div className="absolute left-[50%] w-px h-full bg-yellow-600" />
              <div className="absolute left-[70%] w-px h-full bg-red-600" />
              <div className="absolute right-0 w-px h-full bg-gray-400" />
            </div>
          </div>

          {/* Current Position Indicator */}
          <div
            className="absolute top-8 left-0 transform -translate-x-1/2"
            style={{ left: `${Math.min(percentage, 100)}%` }}
          >
            <div className="text-xs font-medium text-gray-700 whitespace-nowrap text-center">
              {formatCurrency(committedAmount)} / {formatCurrency(totalIncome)}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Fixed Expenses
          </h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(fixedExpenses.amount)}
          </p>
          <p className="text-sm text-gray-500">
            {fixedExpenses.percentage}% of income
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Debt Payments
          </h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(debtPayments.amount)}
          </p>
          <p className="text-sm text-gray-500">
            {debtPayments.percentage}% of income
          </p>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>{t('attention')}:</strong> {t('attentionCommitment')}
        </p>
      </div>
    </div>
  );
};
