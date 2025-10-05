export interface MonthlyFinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  month: number;
  year: number;
}

export interface MonthlyComparisonData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  surplus: number;
  billsToPay: number;
  installments: number;
  status: FinancialStatus;
  isCurrent: boolean;
}

export interface TrendAnalysis {
  averageIncome: number;
  averageExpenses: number;
  averageSurplus: number;
  period: string; // e.g., "Últimos 4 meses"
}

export type FinancialStatus = 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';

export interface MonthlyFinancialFilters {
  year: number;
  month?: number; // Se não especificado, mostra todos os meses do ano
}

export interface FinancialStatusConfig {
  status: FinancialStatus;
  label: string;
  color: string;
  bgColor: string;
  threshold: number; // Percentual mínimo de sobra em relação às entradas
}

export interface MonthlyFinancialFiltersProps {
  year: number;
  month?: number;
  nome: string;
  tipo: string;
  isPaid: string;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | undefined) => void;
  onNomeChange: (nome: string) => void;
  onTipoChange: (tipo: string) => void;
  onIsPaidChange: (isPaid: string) => void;
}
