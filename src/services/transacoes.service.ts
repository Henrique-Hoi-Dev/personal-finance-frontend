import { apiClient } from './apiClient';
import {
  Transacao,
  CreateTransacaoPayload,
  UpdateTransacaoPayload,
  TransacaoFilters,
  Balance,
  Category,
  CreateIncomePayload,
  CreateExpensePayload,
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
  const response = await apiClient.get<{
    docs: Transacao[];
    total: number;
    page: number;
    limit: number;
    offset: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>('/transactions', cleanedFilters);

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
export async function getBalance(): Promise<Balance> {
  const response = await apiClient.get<Balance>('/transactions/balance');
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

export async function getExpensesByCategory(): Promise<{
  data: {
    categories: Array<{
      category: string;
      name: string;
      nameEn: string;
      value: number;
      percentage: number;
      color: string;
    }>;
  };
}> {
  const response = await apiClient.get<{
    data: {
      categories: Array<{
        category: string;
        name: string;
        nameEn: string;
        value: number;
        percentage: number;
        color: string;
      }>;
    };
  }>('/transactions/expenses-by-category');
  return response.data;
}