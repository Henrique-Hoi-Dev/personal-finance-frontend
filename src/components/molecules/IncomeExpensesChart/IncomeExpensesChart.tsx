'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeExpensesChartProps {
  data: ChartDataPoint[];
  incomeGrowth: string;
  expenseGrowth: string;
}

export const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({
  data,
  incomeGrowth,
  expenseGrowth,
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
          <p className="text-sm font-medium text-gray-700 mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('trendAnalysisQuestion')}
        </h3>
        <p className="text-sm text-gray-600">{t('last6Months')}</p>
      </div>

      {/* Warning Badge */}
      <div className="mb-4 flex justify-end">
        <div className="bg-red-50 border border-red-200 rounded-md px-3 py-1.5 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-red-600"
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
            {t('expensesGrowingFaster')}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
            domain={[0, 6000]}
            ticks={[0, 1500, 3000, 4500, 6000]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Growth Percentages */}
      <div className="mt-6 flex gap-6 justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">{t('incomeGrowth')}</p>
              <p className="text-lg font-semibold text-green-600">{incomeGrowth}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">{t('expenseGrowth')}</p>
              <p className="text-lg font-semibold text-red-600">{expenseGrowth}</p>
            </div>
      </div>
    </div>
  );
};

