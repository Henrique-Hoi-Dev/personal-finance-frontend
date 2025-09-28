import { apiClient } from './apiClient';
import {
  Transacao,
  CreateTransacaoPayload,
  UpdateTransacaoPayload,
  TransacaoFilters,
  TransacaoResponse,
  DateFilters,
  Balance,
  Category,
  CreateIncomePayload,
  CreateExpensePayload,
  ExpensesByCategoryResponse,
} from '@/types/transacoes';

const cleanFilters = (filters: TransacaoFilters): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

export async function getTransacoes(
  filters?: TransacaoFilters
): Promise<{ data: Transacao[]; total: number; page: number; limit: number }> {
  const cleanedFilters = filters ? cleanFilters(filters) : {};
  const response = await apiClient.get<TransacaoResponse>(
    '/transactions',
    cleanedFilters
  );

  const result = {
    data: response.data.docs,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };

  return result;
}

export async function getTransacaoById(id: string): Promise<Transacao> {
  const response = await apiClient.get<Transacao>(`/transactions/${id}`);
  return response.data;
}

export async function createTransacao(
  data: CreateTransacaoPayload,
  type: 'INCOME' | 'EXPENSE'
): Promise<Transacao> {
  // Usa rota específica baseada no tipo
  const endpoint =
    type === 'INCOME' ? '/transactions/income' : '/transactions/expense';
  const response = await apiClient.post<Transacao>(endpoint, data);
  return response.data;
}

export async function updateTransacao(
  data: UpdateTransacaoPayload
): Promise<Transacao> {
  const response = await apiClient.put<Transacao>(
    `/transactions/${data.id}`,
    data
  );
  return response.data;
}

export async function deleteTransacao(id: string): Promise<void> {
  await apiClient.delete(`/transactions/${id}`);
}

export async function getTransacoesByConta(
  contaId: string
): Promise<Transacao[]> {
  const response = await apiClient.get<Transacao[]>(
    `/accounts/${contaId}/transactions`
  );
  return response.data;
}

// New endpoints
export async function getBalance(filters?: DateFilters): Promise<Balance> {
  const params = new URLSearchParams();
  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.month) params.append('month', filters.month.toString());

  const url = `/transactions/balance${
    params.toString() ? `?${params.toString()}` : ''
  }`;
  const response = await apiClient.get<Balance>(url);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/transactions/categories');
  return response.data;
}

export async function createIncome(
  data: CreateIncomePayload
): Promise<Transacao> {
  const response = await apiClient.post<Transacao>(
    '/transactions/income',
    data
  );
  return response.data;
}

export async function createExpense(
  data: CreateExpensePayload
): Promise<Transacao> {
  const response = await apiClient.post<Transacao>(
    '/transactions/expense',
    data
  );
  return response.data;
}

export async function getExpensesByCategory(
  filters?: DateFilters
): Promise<ExpensesByCategoryResponse> {
  const params = new URLSearchParams();
  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.month) params.append('month', filters.month.toString());

  const url = `/transactions/expenses-by-category${
    params.toString() ? `?${params.toString()}` : ''
  }`;
  const response = await apiClient.get<ExpensesByCategoryResponse>(url);
  return response.data;
}
