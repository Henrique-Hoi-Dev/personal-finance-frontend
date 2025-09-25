import { apiClient } from './apiClient';
import {
  Transacao,
  CreateTransacaoPayload,
  UpdateTransacaoPayload,
  TransacaoFilters,
} from '@/types/transacoes';

export async function getTransacoes(
  filters?: TransacaoFilters
): Promise<Transacao[]> {
  const params = new URLSearchParams();

  if (filters?.tipo) params.append('tipo', filters.tipo);
  if (filters?.categoria) params.append('categoria', filters.categoria);
  if (filters?.contaId) params.append('contaId', filters.contaId);
  if (filters?.dataInicio) params.append('dataInicio', filters.dataInicio);
  if (filters?.dataFim) params.append('dataFim', filters.dataFim);

  const queryString = params.toString();
  const endpoint = queryString ? `/transacoes?${queryString}` : '/transacoes';

  const response = await apiClient.get<Transacao[]>(endpoint);
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
