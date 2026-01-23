'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProjectionDataPoint {
  period: string;
  balance: number;
}

interface FutureProjectionProps {
  data: ProjectionDataPoint[];
  monthlyNetChange: number;
  projectedBalance: number;
}

export const FutureProjection: React.FC<FutureProjectionProps> = ({
  data,
  monthlyNetChange,
  projectedBalance,
}) => {
  const t = useTranslations('Dashboard');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">
            {payload[0].payload.period}
          </p>
          <p className="text-sm text-green-600 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('whatHappensNext')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('whatHappensNextSubtitle')}
        </p>
      </div>

      {/* Future Projection Box */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('futureProjection')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('futureProjectionSubtitle')}
          </p>
        </div>

        {/* Line Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis
                dataKey="period"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
                domain={[0, 12000]}
                ticks={[0, 3000, 6000, 9000, 12000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-gray-600 mb-2">
              {t('monthlyNetChange')}
            </p>
            <p className="text-3xl font-bold text-green-600">
              {monthlyNetChange >= 0 ? '+' : ''}
              {formatCurrency(monthlyNetChange)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm font-medium text-gray-600 mb-2">
              {t('projectedBalance')} (3 {t('months')})
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(projectedBalance)}
            </p>
          </div>
        </div>

        {/* Positive Trend Message */}
        <div className="bg-white rounded-lg p-4 border border-green-300">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
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
            <div>
              <p className="text-sm font-medium text-green-800 mb-1">
                {t('positiveTrend')}:
              </p>
              <p className="text-sm text-green-700">
                {t('positiveTrendMessage', {
                  amount: formatCurrency(Math.abs(monthlyNetChange)),
                  balance: formatCurrency(projectedBalance),
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          {t('projectionDisclaimer')}
        </p>
      </div>
    </div>
  );
};

