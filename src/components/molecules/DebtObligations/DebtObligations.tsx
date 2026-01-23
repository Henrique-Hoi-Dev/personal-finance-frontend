import React from 'react';
import { useTranslations } from 'next-intl';

interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  monthlyPayment: number;
  remainingMonths: number;
  totalMonths: number;
  paidPercentage: number;
}

interface DebtObligationsProps {
  totalFinanced: number;
  monthlyPayment: number;
  longestDuration: number;
  activeDebts: Debt[];
}

export const DebtObligations: React.FC<DebtObligationsProps> = ({
  totalFinanced,
  monthlyPayment,
  longestDuration,
  activeDebts,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('debtObligations')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('debtObligationsSubtitle')}
        </p>
      </div>

      {/* Debt & Financing Overview */}
      <div className="bg-red-50 rounded-lg p-6 border border-red-200 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {t('debtFinancingOverview')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('debtFinancingOverviewSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-md">
            <svg
              className="w-5 h-5 text-red-600"
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
            <span className="text-sm font-medium text-red-800">
              {activeDebts.length} {t('activeDebts')}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {t('totalFinanced')}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalFinanced)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {t('monthlyPayment')}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
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
              </div>
              <p className="text-sm font-medium text-gray-600">
                {t('longestDuration')}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {longestDuration} {t('months')}
            </p>
          </div>
        </div>

        {/* Active Debts */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {t('activeDebtsList')}
          </h4>
          <div className="space-y-4">
            {activeDebts.map((debt) => (
              <div
                key={debt.id}
                className="bg-white rounded-lg p-4 border border-red-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-1">
                      {debt.name}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(debt.totalAmount)} {t('total')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(debt.monthlyPayment)}/{t('month')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {debt.remainingMonths}/{debt.totalMonths} {t('remaining')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${debt.paidPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      {debt.paidPercentage}% {t('paid')}
                    </span>
                    <span>
                      {100 - debt.paidPercentage}% {t('remaining')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Pressure Alert */}
        <div className="bg-red-100 border border-red-300 rounded-md p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
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
            <p className="text-sm text-red-800">
              <strong>{t('financialPressureAlert')}:</strong>{' '}
              {t('financialPressureAlertMessage', {
                amount: formatCurrency(monthlyPayment),
                months: longestDuration,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

