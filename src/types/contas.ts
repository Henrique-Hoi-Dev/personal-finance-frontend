export interface Installment {
  id: string;
  amount: number;
  number: number;
  dueDate: string;
  isPaid: boolean;
  paidAt: string | null;
}

export interface Conta {
  id: string;
  name: string;
  type:
    | 'FIXED'
    | 'LOAN'
    | 'CREDIT_CARD'
    | 'SUBSCRIPTION'
    | 'OTHER';
  totalAmount: number;
  installments?: number;
  installmentAmount?: number;
  totalWithInterest?: number;
  interestRate?: number;
  monthlyInterestRate?: number;
  amountPaid?: number;
  isPreview?: boolean;
  startDate: string;
  isPaid: boolean;
  dueDay: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  installmentList?: Installment[];
  // Novos campos da API
  referenceMonth?: number;
  referenceYear?: number;
  installment?: {
    amount: number;
    id: string;
    number: number;
    dueDate: string;
    isPaid: boolean;
    paidAt: string | null;
    referenceMonth: number;
    referenceYear: number;
  };
}

export interface CreateContaPayload {
  userId: string;
  name: string;
  type:
    | 'FIXED'
    | 'LOAN'
    | 'CREDIT_CARD'
    | 'SUBSCRIPTION'
    | 'OTHER';
  totalAmount: number;
  installments?: number;
  installmentAmount?: number;
  isPreview?: boolean;
  startDate: string;
  dueDay: number;
  referenceMonth?: number;
  referenceYear?: number;
}

export interface UpdateContaPayload {
  id: string;
  name?: string;
  type?:
    | 'FIXED'
    | 'LOAN'
    | 'CREDIT_CARD'
    | 'SUBSCRIPTION'
    | 'OTHER';
  totalAmount?: number;
  installments?: number;
  isPreview?: boolean;
  startDate?: string;
  dueDay?: number;
}

// Types for installments
export interface InstallmentService {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  installments: number;
  current_installment: number;
  status: 'paid' | 'unpaid' | 'overdue';
  category?: string;
  account_id: string;
  payment_date?: string;
  payment_amount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstallmentPayload {
  description: string;
  amount: number;
  due_date: string;
  installments: number;
  category?: string;
}

export interface PayInstallmentPayload {
  payment_date?: string;
  payment_amount?: number;
}

export interface GetInstallmentsParams {
  page?: number;
  limit?: number;
  status?: 'paid' | 'unpaid' | 'overdue';
  due_date_from?: string;
  due_date_to?: string;
}

export interface GetAllInstallmentsParams extends GetInstallmentsParams {
  account_id?: string;
  category?: string;
}

// Import common types
import { PaginatedResponse } from './common';

// Re-export for convenience
export type { PaginatedResponse };

// Types for monthly comparison endpoint
export interface MonthlyComparisonData {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  billsToPay: number;
  id: string;
  userId: string;
  referenceMonth: number;
  referenceYear: number;
  billsCount: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  lastCalculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyComparisonResponse {
  docs: MonthlyComparisonData[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Types for period accounts endpoint
export interface PeriodAccount {
  id: string;
  userId: string;
  name: string;
  type:
    | 'FIXED'
    | 'LOAN'
    | 'CREDIT_CARD'
    | 'SUBSCRIPTION'
    | 'OTHER';
  totalAmount: number;
  installmentAmount?: number | null;
  totalWithInterest?: number | null;
  interestRate?: number | null;
  monthlyInterestRate?: number | null;
  isPaid: boolean;
  installments?: number | null;
  dueDay: number;
  isPreview: boolean;
  startDate: string;
  referenceMonth: number;
  referenceYear: number;
  createdAt: string;
  updatedAt: string;
  installmentList: Installment[];
  amountPaid?: number;
}

export interface PeriodAccountsResponse {
  docs: PeriodAccount[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetPeriodAccountsParams {
  month?: number;
  year?: number;
  type?: string;
  isPaid?: boolean;
  name?: string;
  search?: string; // Filtro de busca por texto
  limit?: number;
  page?: number;
}
export interface GetContasParams {
  month?: number;
  year?: number;
  type?: string;
  isPaid?: boolean;
  search?: string; // Filtro de busca por texto
}

// Types for dashboard endpoint
export interface DashboardAllResponse {
  billsCount: number;
  billsToPay: number;
  month: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  totalBalance: number;
  totalExpenses: number;
  totalIncome: number;
  year: number;
}
