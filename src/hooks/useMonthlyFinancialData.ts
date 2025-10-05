import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  MonthlyFinancialSummary,
  MonthlyComparisonData,
  TrendAnalysis,
  FinancialStatus,
  MonthlyFinancialFilters,
} from '@/types/monthly-financial';
import { getBalance } from '@/services/transacoes.service';

const FINANCIAL_STATUS_CONFIG: Record<
  FinancialStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    threshold: number;
  }
> = {
  EXCELLENT: {
    label: 'Excelente',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    threshold: 0.2,
  },
  GOOD: {
    label: 'Bom',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    threshold: 0.1,
  },
  WARNING: {
    label: 'Atenção',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    threshold: 0.05,
  },
  CRITICAL: {
    label: 'Crítico',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    threshold: 0,
  },
};

export const useMonthlyFinancialData = () => {
  const t = useTranslations('MonthlyFinancial');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MonthlyFinancialSummary | null>(null);
  const [comparisonData, setComparisonData] = useState<MonthlyComparisonData[]>(
    []
  );
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(
    null
  );
  const [filters, setFilters] = useState<MonthlyFinancialFilters>({
    year: 2025,
    month: new Date().getMonth() + 1,
  });

  const getFinancialStatus = (
    surplus: number,
    income: number
  ): FinancialStatus => {
    if (income === 0) return 'CRITICAL';

    const surplusPercentage = surplus / income;

    if (surplusPercentage >= FINANCIAL_STATUS_CONFIG.EXCELLENT.threshold)
      return 'EXCELLENT';
    if (surplusPercentage >= FINANCIAL_STATUS_CONFIG.GOOD.threshold)
      return 'GOOD';
    if (surplusPercentage >= FINANCIAL_STATUS_CONFIG.WARNING.threshold)
      return 'WARNING';
    return 'CRITICAL';
  };

  const calculateMonthlySummary = useCallback(
    async (year: number, month: number) => {
      try {
        const balanceData = await getBalance({ year, month });

        const income = balanceData.income;
        const expenses = balanceData.expense;
        const surplus = income - expenses;
        const totalBalance = balanceData.balance;

        return {
          totalBalance,
          monthlyIncome: income,
          monthlyExpenses: expenses,
          monthlySurplus: surplus,
          month,
          year,
        };
      } catch (error) {
        console.error('Erro ao calcular resumo mensal:', error);
        return null;
      }
    },
    []
  );

  const generateComparisonData = useCallback(
    async (year: number) => {
      try {
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const comparisonPromises = months.map(async (month) => {
          const summary = await calculateMonthlySummary(year, month);
          if (!summary) return null;

          // Calcular contas a pagar (simplificado - pode ser melhorado)
          const billsToPay = summary.monthlyExpenses * 0.3; // 30% das despesas como exemplo
          const installments = Math.floor(billsToPay / 1000) + 1; // Simulação de parcelas

          const status = getFinancialStatus(
            summary.monthlySurplus,
            summary.monthlyIncome
          );
          const isCurrent = month === currentMonth && year === currentYear;

          return {
            month: new Date(year, month - 1).toLocaleDateString('pt-BR', {
              month: 'long',
            }),
            year,
            income: summary.monthlyIncome,
            expenses: summary.monthlyExpenses,
            surplus: summary.monthlySurplus,
            billsToPay,
            installments,
            status,
            isCurrent,
          };
        });

        const results = await Promise.all(comparisonPromises);
        return results.filter(Boolean) as MonthlyComparisonData[];
      } catch (error) {
        console.error('Erro ao gerar dados de comparação:', error);
        return [];
      }
    },
    [calculateMonthlySummary]
  );

  const calculateTrendAnalysis = useCallback(
    (data: MonthlyComparisonData[]): TrendAnalysis => {
      if (data.length === 0) {
        return {
          averageIncome: 0,
          averageExpenses: 0,
          averageSurplus: 0,
          period: 'Nenhum dado disponível',
        };
      }

      const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
      const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
      const totalSurplus = data.reduce((sum, item) => sum + item.surplus, 0);

      return {
        averageIncome: totalIncome / data.length,
        averageExpenses: totalExpenses / data.length,
        averageSurplus: totalSurplus / data.length,
        period: `Últimos ${data.length} meses`,
      };
    },
    []
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, comparisonData] = await Promise.all([
        calculateMonthlySummary(
          filters.year,
          filters.month || new Date().getMonth() + 1
        ),
        generateComparisonData(filters.year),
      ]);

      setSummary(summaryData);
      setComparisonData(comparisonData);

      if (comparisonData.length > 0) {
        setTrendAnalysis(calculateTrendAnalysis(comparisonData));
      }
    } catch (error) {
      console.error('Erro ao buscar dados financeiros mensais:', error);
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    calculateMonthlySummary,
    generateComparisonData,
    calculateTrendAnalysis,
  ]);

  const updateFilters = useCallback(
    (newFilters: Partial<MonthlyFinancialFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    summary,
    comparisonData,
    trendAnalysis,
    filters,
    updateFilters,
    refetch: fetchData,
    financialStatusConfig: FINANCIAL_STATUS_CONFIG,
  };
};
