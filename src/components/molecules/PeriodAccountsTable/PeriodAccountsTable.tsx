import React from 'react';
import { useTranslations } from 'next-intl';
import { PeriodAccount } from '@/types/contas';
import { formatCurrencyFromCents } from '@/utils';

interface PeriodAccountsTableProps {
  data: PeriodAccount[];
  loading?: boolean;
  onViewDetails?: (accountId: string) => void;
}

export const PeriodAccountsTable: React.FC<PeriodAccountsTableProps> = ({
  data,
  loading = false,
  onViewDetails,
}) => {
  const t = useTranslations('Contas');

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      FIXED: t('accountTypes.FIXED'),
      FIXED_PREVIEW: t('accountTypes.FIXED_PREVIEW'),
      LOAN: t('accountTypes.LOAN'),
      CREDIT_CARD: t('accountTypes.CREDIT_CARD'),
      SUBSCRIPTION: t('accountTypes.SUBSCRIPTION'),
      OTHER: t('accountTypes.OTHER'),
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getStatusBadge = (isPaid: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isPaid ? t('paid') : t('unpaid')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">{t('noAccounts')}</div>
          <p className="text-gray-400">{t('noAccountsDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('periodAccounts')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('periodAccountsDescription')}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('type')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('amount')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('dueDay')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('startDate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {account.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {account.startDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getTypeLabel(account.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrencyFromCents(account.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.dueDay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(account.startDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(account.isPaid)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails?.(account.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    {t('viewDetails')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
