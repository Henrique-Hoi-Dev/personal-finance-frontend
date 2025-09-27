export interface Transacao {
  id: string;
  value: number;
  userId: string;
  accountId: string;
  installmentId: string | null;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  account: {
    totalAmount: number;
    id: string;
    name: string;
    type: string;
    isPaid: boolean;
    installmentList: any[];
  };
}

export interface CreateTransacaoPayload {
  description: string;
  value: number;
  category: string;
  accountId: string | null;
}

export interface UpdateTransacaoPayload {
  id: string;
  description?: string;
  valor?: number;
  tipo?: 'INCOME' | 'EXPENSE';
  categoria?: string;
  data?: string;
  contaId?: string;
}

export interface TransacaoFilters {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
  fixedAccountsTotal: number;
  loanAccountsTotal: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  isDefault: boolean;
  ptBr: string;
  en: string;
}

export interface CreateIncomePayload {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  contaId: string;
}

export interface CreateExpensePayload {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  contaId: string;
}

export interface ExpenseByCategory {
  category: string;
  name: string;
  nameEn: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ExpensesByCategoryResponse {
  categories: ExpenseByCategory[];
}
