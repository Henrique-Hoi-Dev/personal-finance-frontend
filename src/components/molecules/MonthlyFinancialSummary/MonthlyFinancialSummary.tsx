import React from 'react';
import { useTranslations } from 'next-intl';
import { MonthlyFinancialSummary as MonthlySummary } from '@/types/monthly-financial';
import { formatCurrencyFromCents } from '@/utils';

interface MonthlyFinancialSummaryProps {
  data: MonthlySummary | null;
  loading?: boolean;
}

export const MonthlyFinancialSummary: React.FC<
  MonthlyFinancialSummaryProps
> = ({ data, loading = false }) => {
  const t = useTranslations('MonthlyFinancial');

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Se não há dados, usar valores padrão zerados
  const defaultData = {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySurplus: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };

  const financialData = data || defaultData;

  const monthName = new Date(
    financialData.year,
    financialData.month - 1
  ).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const summaryCards = [
    {
      title: t('totalBalance'),
      value: formatCurrencyFromCents(financialData.monthlySurplus),
      color: 'text-green-600',
    },
    {
      title: `${t('income')} ${monthName}`,
      value: formatCurrencyFromCents(financialData.monthlyIncome),
      color: 'text-green-600',
    },
    {
      title: `${t('expenses')} ${monthName}`,
      value: formatCurrencyFromCents(financialData.monthlyExpenses),
      color: 'text-red-600',
    },
    {
      title: `${t('surplus')} ${monthName}`,
      value: formatCurrencyFromCents(financialData.totalBalance),
      color:
        financialData.totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
              {card.title}
            </p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
