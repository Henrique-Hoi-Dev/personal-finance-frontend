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
  }>('/transacoes', filters);
  return response.data;
}

export async function getTransacaoById(id: string): Promise<Transacao> {
  const response = await apiClient.get<Transacao>(`/transacoes/${id}`);
  return response.data;
}

export async function createTransacao(
  data: CreateTransacaoPayload
): Promise<Transacao> {
  const response = await apiClient.post<Transacao>('/transacoes', data);
  return response.data;
}

export async function updateTransacao(
  data: UpdateTransacaoPayload
): Promise<Transacao> {
  const response = await apiClient.put<Transacao>(
    `/transacoes/${data.id}`,
    data
  );
  return response.data;
}

export async function deleteTransacao(id: string): Promise<void> {
  await apiClient.delete(`/transacoes/${id}`);
}

export async function getTransacoesByConta(
  contaId: string
): Promise<Transacao[]> {
  const response = await apiClient.get<Transacao[]>(
    `/contas/${contaId}/transacoes`
  );
  return response.data;
}

// New endpoints
export async function getBalance(): Promise<Balance> {
  const response = await apiClient.get<Balance>('/transacoes/balance');
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/transacoes/categories');
  return response.data;
}

export async function createIncome(
  data: CreateIncomePayload
): Promise<Transacao> {
  const response = await apiClient.post<Transacao>('/transacoes/income', data);
  return response.data;
}

export async function createExpense(
  data: CreateExpensePayload
): Promise<Transacao> {
  const response = await apiClient.post<Transacao>('/transacoes/expense', data);
  return response.data;
}
