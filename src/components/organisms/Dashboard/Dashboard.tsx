import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SummaryCard,
  TransactionItem,
  CategoryItem,
  CurrentSituationCard,
  IncomeExpensesChart,
  IncomeCommitment,
  ExpenseStructure,
  DebtObligations,
  FutureProjection,
  TransactionPatterns,
  TimeToReflect,
} from '@/components/molecules';
import {
  getBalance,
  getTransacoes,
  getExpensesByCategory,
} from '@/services/transacoes.service';
import { Balance, Transacao, ExpenseByCategory } from '@/types/transacoes';
import { BaseLoading, BaseSelectWithClear } from '@/components/atoms';
import { formatCurrencyFromCents } from '@/utils';
import {
  monthOptions,
  generateYearOptions,
  getCategoryLabel,
} from '@/utils/enums';
import { useLanguage } from '@/hooks/useLanguage';

export const Dashboard: React.FC = () => {
  const t = useTranslations('Dashboard');
  const tCommon = useTranslations('Common');
  const { currentLanguage } = useLanguage();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [categories, setCategories] = useState<ExpenseByCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1
  );

  const handleYearChange = (value: string | number) => {
    if (value === '' || value === null || value === undefined) {
      setSelectedYear(currentDate.getFullYear());
    } else {
      setSelectedYear(parseInt(value.toString()));
    }
  };

  const handleMonthChange = (value: string | number) => {
    if (value === '' || value === null || value === undefined) {
      setSelectedMonth(currentDate.getMonth() + 1);
    } else {
      setSelectedMonth(parseInt(value.toString()));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [balanceData, transactionsData, categoriesData] =
          await Promise.all([
            getBalance({ year: selectedYear, month: selectedMonth }),
            getTransacoes({ limit: 5, page: 0 }),
            getExpensesByCategory({ year: selectedYear, month: selectedMonth }),
          ]);

        setBalance(balanceData);
        setTransactions(transactionsData?.data || []);
        setCategories(categoriesData?.categories || []);
      } catch (error) {
        console.error('Dashboard: Erro ao carregar dados:', error);
        // Em caso de erro, não seta loading como false para mostrar dados hardcoded
      } finally {
        setLoading(false);
      }
    };

    // Comentado temporariamente para usar dados hardcoded
    // fetchData();
    setLoading(false);
  }, [selectedYear, selectedMonth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <BaseLoading text={t('loading')} />
      </div>
    );
  }

  const mainBalance = {
    title: t('currentBalance'),
    value: balance ? formatCurrencyFromCents(balance.balance) : 'R$ 0,00',
    color: 'green' as const,
    icon: (
      <svg
        className="w-8 h-8 text-green-600"
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
  };

  // 6 big numbers em grid
  const summaryData = [
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
      title: t('linkedExpenses'),
      value: balance
        ? formatCurrencyFromCents(balance.linkedExpenses)
        : 'R$ 0,00',
      color: 'orange' as const,
      icon: (
        <svg
          className="w-6 h-6 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      title: t('standaloneExpenses'),
      value: balance
        ? formatCurrencyFromCents(balance.standaloneExpenses)
        : 'R$ 0,00',
      color: 'pink' as const,
      icon: (
        <svg
          className="w-6 h-6 text-pink-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      title: t('fixedAccounts'),
      value: balance
        ? formatCurrencyFromCents(balance.fixedAccountsTotal)
        : 'R$ 0,00',
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
      value: balance
        ? formatCurrencyFromCents(balance.loanAccountsTotal)
        : 'R$ 0,00',
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
    {
      title: t('totalAccounts'),
      value: balance
        ? formatCurrencyFromCents(balance.totalAccounts)
        : 'R$ 0,00',
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  const categoriesData = categories.map((category) => ({
    name:
      getCategoryLabel(category.category, currentLanguage as 'pt' | 'en') ||
      category.name,
    amount: formatCurrencyFromCents(category.value),
    color: category.color,
    percentage: category.percentage,
  }));

  // Dados hardcoded para Current Situation
  const currentSituationData = {
    balance: {
      value: 'R$ 8.450,00',
      change: {
        amount: 'R$ 1.750,00',
        percentage: '-17.2%',
        isPositive: false,
      },
      warning:
        'Warning: Your balance is declining. Review your expenses carefully.',
      trend: 'down' as const,
    },
    income: {
      value: 'R$ 5.194,00',
      change: {
        amount: 'R$ 556,00',
        percentage: '+12.0%',
        isPositive: true,
      },
      trend: 'up' as const,
    },
    expenses: {
      value: 'R$ 4.319,00',
      change: {
        amount: 'R$ 1.139,00',
        percentage: '+35.8%',
        isPositive: false,
      },
      trend: 'up' as const,
    },
  };

  // Dados hardcoded para o gráfico de tendência (últimos 6 meses)
  const chartData = [
    { month: 'Jan', income: 4638, expenses: 3000 },
    { month: 'Feb', income: 4780, expenses: 3100 },
    { month: 'Mar', income: 4950, expenses: 3200 },
    { month: 'Apr', income: 4850, expenses: 3300 },
    { month: 'May', income: 5100, expenses: 3400 },
    { month: 'Jun', income: 5194, expenses: 4319 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('currentSituation')}: {t('currentSituationSubtitle')}
        </h1>
        <p className="mt-1 text-sm text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Current Situation Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('currentSituation')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CurrentSituationCard
            title={t('currentBalance')}
            value={currentSituationData.balance.value}
            change={currentSituationData.balance.change}
            warning={t('balanceDecliningWarning')}
            trend={currentSituationData.balance.trend}
          />
          <CurrentSituationCard
            title={t('totalIncome')}
            value={currentSituationData.income.value}
            change={currentSituationData.income.change}
            trend={currentSituationData.income.trend}
          />
          <CurrentSituationCard
            title={t('totalExpenses')}
            value={currentSituationData.expenses.value}
            change={currentSituationData.expenses.change}
            trend={currentSituationData.expenses.trend}
          />
        </div>
      </div>

      {/* Trend Analysis Section */}
      <div className="mb-8">
        <IncomeExpensesChart
          data={chartData}
          incomeGrowth="+15.4%"
          expenseGrowth="+35.0%"
        />
      </div>

      {/* Income Commitment Section */}
      <div className="mb-8">
        <IncomeCommitment
          percentage={56}
          totalIncome={5194}
          committedAmount={2900}
          fixedExpenses={{
            amount: 2100,
            percentage: 40.4,
          }}
          debtPayments={{
            amount: 800,
            percentage: 15.4,
          }}
        />
      </div>

      {/* Expense Structure Section */}
      <div className="mb-8">
        <ExpenseStructure
          categories={[
            {
              name: t('fixedExpenses'),
              amount: 2100,
              percentage: 48.6,
              color: '#9ca3af', // gray
            },
            {
              name: t('variableExpenses'),
              amount: 1419,
              percentage: 32.9,
              color: '#3b82f6', // blue
            },
            {
              name: t('debtFinancing'),
              amount: 800,
              percentage: 18.5,
              color: '#ef4444', // red
            },
          ]}
          totalExpenses={4319}
        />
      </div>

      {/* Debt Obligations Section */}
      <div className="mb-8">
        <DebtObligations
          totalFinanced={29800}
          monthlyPayment={800}
          longestDuration={36}
          activeDebts={[
            {
              id: '1',
              name: t('carFinancing'),
              totalAmount: 28000,
              monthlyPayment: 650,
              remainingMonths: 36,
              totalMonths: 60,
              paidPercentage: 40,
            },
            {
              id: '2',
              name: t('creditCardInstallments'),
              totalAmount: 1800,
              monthlyPayment: 150,
              remainingMonths: 10,
              totalMonths: 12,
              paidPercentage: 17,
            },
          ]}
        />
      </div>

      {/* Future Projection Section */}
      <div className="mb-8">
        <FutureProjection
          data={[
            { period: t('current'), balance: 8500 },
            { period: t('monthPlus1'), balance: 9300 },
            { period: t('monthPlus2'), balance: 10200 },
            { period: t('monthPlus3'), balance: 11075 },
          ]}
          monthlyNetChange={875}
          projectedBalance={11075}
        />
      </div>

      {/* Transaction Patterns Section */}
      <div className="mb-8">
        <TransactionPatterns
          groups={[
            {
              type: 'income',
              count: 1,
              total: 5194,
              transactions: [
                {
                  id: '1',
                  description: t('salary'),
                  date: '2024-06-05',
                  amount: 5194,
                },
              ],
            },
            {
              type: 'fixed',
              count: 5,
              total: 2100,
              transactions: [
                {
                  id: '2',
                  description: t('rentRecurring'),
                  date: '2024-06-01',
                  amount: 1500,
                  isRecurring: true,
                },
                {
                  id: '3',
                  description: t('internetUtilitiesRecurring'),
                  date: '2024-06-03',
                  amount: 280,
                  isRecurring: true,
                },
                {
                  id: '4',
                  description: t('gymMembershipRecurring'),
                  date: '2024-06-02',
                  amount: 120,
                  isRecurring: true,
                },
                {
                  id: '5',
                  description: t('streamingServicesRecurring'),
                  date: '2024-06-01',
                  amount: 85,
                  isRecurring: true,
                },
                {
                  id: '6',
                  description: t('carInsuranceRecurring'),
                  date: '2024-06-10',
                  amount: 115,
                  isRecurring: true,
                },
              ],
            },
            {
              type: 'installment',
              count: 2,
              total: 800,
              transactions: [
                {
                  id: '7',
                  description: t('carFinancing'),
                  date: '2024-06-05',
                  amount: 650,
                  installmentInfo: '24/60',
                },
                {
                  id: '8',
                  description: t('creditCard'),
                  date: '2024-06-15',
                  amount: 150,
                  installmentInfo: '2/12',
                },
              ],
            },
            {
              type: 'variable',
              count: 4,
              total: 1419,
              transactions: [
                {
                  id: '9',
                  description: t('groceries'),
                  date: '2024-06-12',
                  amount: 620,
                },
                {
                  id: '10',
                  description: t('restaurants'),
                  date: '2024-06-18',
                  amount: 340,
                },
                {
                  id: '11',
                  description: t('gas'),
                  date: '2024-06-08',
                  amount: 280,
                },
                {
                  id: '12',
                  description: t('shopping'),
                  date: '2024-06-20',
                  amount: 179,
                },
              ],
            },
          ]}
          recurringCount={5}
          installmentCount={2}
        />
      </div>

      {/* Time to Reflect Section */}
      <div className="mb-8">
        <TimeToReflect
          cards={[
            {
              question: t('isThisSustainable'),
              answer: t('isThisSustainableAnswer'),
            },
            {
              question: t('whatNeedsToChange'),
              answer: t('whatNeedsToChangeAnswer'),
            },
            {
              question: t('whatsYourTrend'),
              answer: t('whatsYourTrendAnswer'),
            },
          ]}
        />
      </div>

      {/* Filtros de Data */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('year')}
            </label>
            <BaseSelectWithClear
              value={selectedYear.toString()}
              onChange={handleYearChange}
              options={generateYearOptions()}
              placeholder={t('selectYear')}
              className="w-full"
              showClearButton={true}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('month')}
            </label>
            <BaseSelectWithClear
              value={selectedMonth.toString()}
              onChange={handleMonthChange}
              options={monthOptions}
              placeholder={t('selectMonth')}
              className="w-full"
              showClearButton={true}
            />
          </div>
        </div>
      </div>

      {/* Saldo Principal - Linha Única */}
      <div className="mb-8 "></div>

      {/* Big Numbers - Organizados por categoria */}

      {/* Primeira linha - Entradas e Saldo Atual */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Entradas e Saldo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            title={summaryData[0].title}
            value={summaryData[0].value}
            icon={summaryData[0].icon}
            color={summaryData[0].color}
          />
          <SummaryCard
            title={mainBalance.title}
            value={mainBalance.value}
            icon={mainBalance.icon}
            color={mainBalance.color}
          />
        </div>
      </div>

      {/* Segunda linha - Saídas */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Saídas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title={summaryData[1].title}
            value={summaryData[1].value}
            icon={summaryData[1].icon}
            color={summaryData[1].color}
          />
          <SummaryCard
            title={summaryData[2].title}
            value={summaryData[2].value}
            icon={summaryData[2].icon}
            color={summaryData[2].color}
          />
          <SummaryCard
            title={summaryData[3].title}
            value={summaryData[3].value}
            icon={summaryData[3].icon}
            color={summaryData[3].color}
          />
        </div>
      </div>

      {/* Terceira linha - Contas e Financiamentos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Contas e Financiamentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title={summaryData[4].title}
            value={summaryData[4].value}
            icon={summaryData[4].icon}
            color={summaryData[4].color}
          />
          <SummaryCard
            title={summaryData[5].title}
            value={summaryData[5].value}
            icon={summaryData[5].icon}
            color={summaryData[5].color}
          />
          <SummaryCard
            title={summaryData[6].title}
            value={summaryData[6].value}
            icon={summaryData[6].icon}
            color={summaryData[6].color}
          />
        </div>
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
                {tCommon('noExpensesByCategory')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
