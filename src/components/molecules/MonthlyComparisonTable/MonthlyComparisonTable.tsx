import React from 'react';
import { useTranslations } from 'next-intl';
import {
  MonthlyComparisonData,
  FinancialStatus,
} from '@/types/monthly-financial';
import { formatCurrencyFromCents } from '@/utils';
import { BasePagination } from '@/components/atoms';

interface MonthlyComparisonTableProps {
  data: MonthlyComparisonData[];
  loading?: boolean;
  onViewDetails?: (month: string, year: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export const MonthlyComparisonTable: React.FC<MonthlyComparisonTableProps> = ({
  data,
  loading = false,
  onViewDetails,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 5,
  onPageChange,
}) => {
  const t = useTranslations('MonthlyFinancial');

  const getStatusConfig = (status: FinancialStatus) => {
    const configs = {
      EXCELLENT: {
        label: t('excellent'),
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      GOOD: {
        label: t('good'),
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      WARNING: {
        label: t('warning'),
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      },
      CRITICAL: {
        label: t('critical'),
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      },
    };
    return configs[status];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[...Array(7)].map((_, index) => (
                    <th key={index} className="px-4 py-3 text-left">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100">
                    {[...Array(7)].map((_, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">
            {t('noComparisonData')}
          </div>
          <p className="text-gray-400">{t('noComparisonDataDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('monthlyComparison')}
        </h2>
        <p className="text-gray-600 text-sm">
          {t('monthlyFinancialEvolution')}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('month')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('income')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('expenses')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('surplus')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('billsToPay')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('details')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              const isCurrentMonth = item.isCurrent;

              return (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    isCurrentMonth ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {item.month} {item.year}
                      </div>
                      {isCurrentMonth && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t('current')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrencyFromCents(item.income)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      {formatCurrencyFromCents(item.expenses)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        item.surplus >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.surplus >= 0 ? '+' : ''}
                      {formatCurrencyFromCents(item.surplus)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrencyFromCents(item.billsToPay)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.installments} {t('accounts')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetails?.(item.month, item.year)}
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {t('view')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {onPageChange && totalPages > 1 && (
        <BasePagination
          currentPage={currentPage - 1} // BasePagination usa 0-based
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => onPageChange(page + 1)} // Converter de 0-based para 1-based
          className="bg-white px-4 py-3 border-t border-gray-200"
        />
      )}
    </div>
  );
};
