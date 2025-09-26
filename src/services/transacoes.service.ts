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

export async function getTransacoes(
  filters?: TransacaoFilters
): Promise<{ data: Transacao[]; total: number; page: number; limit: number }> {
  const response = await apiClient.get<{
    data: Transacao[];
    total: number;
    page: number;
    limit: number;
  }>('/transactions', filters);
  return response.data;
}

export async function getTransacaoById(id: string): Promise<Transacao> {
  const response = await apiClient.get<Transacao>(`/transactions/${id}`);
  return response.data;
}

export async function createTransacao(
  data: CreateTransacaoPayload
): Promise<Transacao> {
  const response = await apiClient.post<Transacao>('/transactions', data);
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
  const response = await apiClient.get<{ data: Balance }>(
    '/transactions/balance'
  );
  return response.data.data;
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
