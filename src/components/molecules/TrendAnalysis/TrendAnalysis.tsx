import React from 'react';
import { useTranslations } from 'next-intl';
import { TrendAnalysis as TrendAnalysisData } from '@/types/monthly-financial';
import { formatCurrencyFromCents } from '@/utils';

interface TrendAnalysisProps {
  data: TrendAnalysisData | null;
  loading?: boolean;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  data,
  loading = false,
}) => {
  const t = useTranslations('MonthlyFinancial');

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">{t('noTrendData')}</div>
          <p className="text-gray-400">{t('noTrendDataDescription')}</p>
        </div>
      </div>
    );
  }

  const trendCards = [
    {
      title: t('averageIncome'),
      value: formatCurrencyFromCents(data.averageIncome),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: t('averageExpenses'),
      value: formatCurrencyFromCents(data.averageExpenses),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      title: t('averageSurplus'),
      value: formatCurrencyFromCents(data.averageSurplus),
      color: data.averageSurplus >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.averageSurplus >= 0 ? 'bg-green-50' : 'bg-red-50',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('trendAnalysis')}
        </h2>
        <p className="text-gray-600 text-sm">{data.period}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-4 text-center`}
          >
            <div className="flex items-center justify-center mb-3">
              <div
                className={`p-2 rounded-lg ${card.bgColor.replace(
                  '50',
                  '100'
                )}`}
              >
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
