'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseStructureProps {
  categories: ExpenseCategory[];
  totalExpenses: number;
}

export const ExpenseStructure: React.FC<ExpenseStructureProps> = ({
  categories,
  totalExpenses,
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

  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: cat.color,
  }));

  const COLORS = categories.map((cat) => cat.color);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">
            {data.payload.name}
          </p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {t('whereYourMoneyGoes')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('whereYourMoneyGoesSubtitle')}
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
          {t('highConcentration')}
        </button>
      </div>

      {/* Expense Structure Subsection */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('expenseStructure')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('expenseStructureSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Categories List */}
          <div className="flex flex-col justify-center gap-3">
            {categories.map((category, index) => {
              // First category is always Fixed Expenses
              const hasWarning = category.percentage > 40 && index === 0;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(category.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {category.percentage}% {t('ofTotalExpenses')}
                    </span>
                    {hasWarning && (
                      <svg
                        className="w-4 h-4 text-yellow-600"
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="mt-6 bg-yellow-100 border border-yellow-300 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>{t('warning')}:</strong> {t('warningExpenseStructure')}
        </p>
      </div>
    </div>
  );
};
