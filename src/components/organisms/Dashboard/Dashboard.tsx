import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SummaryCard,
  TransactionItem,
  CategoryItem,
} from '@/components/molecules';
import { getBalance } from '@/services/transacoes.service';
import { Balance } from '@/types/transacoes';
import { BaseLoading } from '@/components/atoms';
import { formatCurrencyFromCents, formatAmount } from '@/utils';

export const Dashboard: React.FC = () => {
  const t = useTranslations('Dashboard');
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const balanceData = await getBalance();
        setBalance(balanceData);
      } catch (error) {
        console.error('Erro ao carregar saldo');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BaseLoading text={t('loading')} />
      </div>
    );
  }

  const summaryData = [
    {
      title: t('currentBalance'),
      value: balance ? formatCurrencyFromCents(balance.balance) : 'R$ 0,00',
      color: 'green' as const,
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
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
      ),
    },
    {
      title: t('income'),
      value: balance ? formatCurrencyFromCents(balance.income) : 'R$ 0,00',
      color: 'green' as const,
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      ),
    },
    {
      title: t('expenses'),
      value: balance ? formatCurrencyFromCents(balance.expense) : 'R$ 0,00',
      color: 'red' as const,
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        </svg>
      ),
    },
  ];

  const transactions = [
    {
      description: 'Salário',
      category: 'Trabalho',
      date: '2024-01-15',
      amount: formatAmount(3500),
      type: 'income' as const,
    },
    {
      description: 'Supermercado',
      category: 'Alimentação',
      date: '2024-01-14',
      amount: formatAmount(450),
      type: 'expense' as const,
    },
    {
      description: 'Conta de Luz',
      category: 'Utilities',
      date: '2024-01-13',
      amount: formatAmount(120),
      type: 'expense' as const,
    },
    {
      description: 'Freelance',
      category: 'Trabalho',
      date: '2024-01-12',
      amount: formatAmount(800),
      type: 'income' as const,
    },
    {
      description: 'Netflix',
      category: 'Entretenimento',
      date: '2024-01-11',
      amount: formatAmount(60),
      type: 'expense' as const,
    },
  ];

  const categories = [
    {
      name: 'Alimentação',
      amount: formatAmount(450),
      color: 'bg-red-500',
      percentage: 60,
    },
    {
      name: 'Utilities',
      amount: formatAmount(120),
      color: 'bg-orange-500',
      percentage: 15,
    },
    {
      name: 'Entretenimento',
      amount: formatAmount(60),
      color: 'bg-purple-500',
      percentage: 8,
    },
    {
      name: 'Transporte',
      amount: formatAmount(200),
      color: 'bg-blue-400',
      percentage: 25,
    },
    {
      name: 'Saúde',
      amount: formatAmount(180),
      color: 'bg-green-600',
      percentage: 20,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((item, index) => (
          <SummaryCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('latestTransactions')}
            </h3>
            <a
              href="/pt/transacoes"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('seeAll')}
            </a>
          </div>
          <div className="space-y-1">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                description={transaction.description}
                category={transaction.category}
                date={transaction.date}
                amount={transaction.amount}
                type={transaction.type}
              />
            ))}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('expensesByCategory')}
          </h3>
          <div className="space-y-1">
            {categories.map((category, index) => (
              <CategoryItem
                key={index}
                name={category.name}
                amount={category.amount}
                color={category.color}
                percentage={category.percentage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
