import React from 'react';
import { useTranslations } from 'next-intl';

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  isRecurring?: boolean;
  installmentInfo?: string;
}

interface TransactionGroup {
  type: 'income' | 'fixed' | 'installment' | 'variable';
  count: number;
  total: number;
  transactions: Transaction[];
}

interface TransactionPatternsProps {
  groups: TransactionGroup[];
  recurringCount: number;
  installmentCount: number;
}

export const TransactionPatterns: React.FC<TransactionPatternsProps> = ({
  groups,
  recurringCount,
  installmentCount,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return t('income');
      case 'fixed':
        return t('fixed');
      case 'installment':
        return t('installment');
      case 'variable':
        return t('variable');
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-50 border-green-200';
      case 'fixed':
        return 'bg-gray-50 border-gray-200';
      case 'installment':
        return 'bg-red-50 border-red-200';
      case 'variable':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getAmountColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('transactionPatterns')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('transactionPatternsSubtitle')}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        {/* Recent Transactions Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('recentTransactions')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('recentTransactionsSubtitle')}
          </p>

          {/* Transaction Groups */}
          <div className="space-y-4">
            {groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className={`rounded-lg p-4 border ${getTypeColor(group.type)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    {getTypeLabel(group.type)} ({group.count})
                  </h4>
                  <p className={`text-lg font-bold ${getAmountColor(group.type)}`}>
                    {formatCurrency(group.total)}
                  </p>
                </div>

                <div className="space-y-2">
                  {group.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </span>
                          {transaction.isRecurring && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                              {t('recurring')}
                            </span>
                          )}
                          {transaction.installmentInfo && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                              {transaction.installmentInfo}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold ${getAmountColor(group.type)}`}
                      >
                        {group.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Recognition Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>{t('patternRecognition')}:</strong>{' '}
            {t('patternRecognitionMessage', {
              recurring: recurringCount,
              installments: installmentCount,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

