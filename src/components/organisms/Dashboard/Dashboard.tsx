import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SummaryCard,
  TransactionItem,
  CategoryItem,
} from '@/components/molecules';
import {
  getBalance,
  getTransacoes,
  getExpensesByCategory,
} from '@/services/transacoes.service';
import { Balance, Transacao, ExpenseByCategory } from '@/types/transacoes';
import { BaseLoading } from '@/components/atoms';
import { formatCurrencyFromCents } from '@/utils';

export const Dashboard: React.FC = () => {
  const t = useTranslations('Dashboard');
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [categories, setCategories] = useState<ExpenseByCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [balanceData, transactionsData, categoriesData] =
          await Promise.all([
            getBalance(),
            getTransacoes({ limit: 5, page: 0 }),
            getExpensesByCategory(),
          ]);

        setBalance(balanceData);
        setTransactions(transactionsData.data);
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error('Dashboard: Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    {
      title: t('fixedAccounts'),
      value: 'R$ 0,00', // TODO: Conectar com dados do backend
      color: 'blue' as const,
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: t('loans'),
      value: 'R$ 0,00', // TODO: Conectar com dados do backend
      color: 'purple' as const,
      icon: (
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  // Transform categories data for CategoryItem component
  const categoriesData = categories.map((category) => ({
    name: category.name,
    amount: formatCurrencyFromCents(category.value),
    color: category.color, // Use the hex color directly
    percentage: category.percentage,
  }));

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
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  description={transaction.description}
                  category={transaction.category}
                  date={transaction.date}
                  amount={formatCurrencyFromCents(transaction.value)}
                  type={transaction.type.toLowerCase() as 'income' | 'expense'}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                {t('noTransactions')}
              </div>
            )}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('expensesByCategory')}
          </h3>
          <div className="space-y-1">
            {categoriesData.length > 0 ? (
              categoriesData.map((category, index) => (
                <CategoryItem
                  key={index}
                  name={category.name}
                  amount={category.amount}
                  color={category.color}
                  percentage={category.percentage}
                />
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Nenhum gasto por categoria encontrado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
