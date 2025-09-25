import { apiClient } from './apiClient';
import { Conta, CreateContaPayload, UpdateContaPayload } from '@/types/contas';

export async function getContas(): Promise<Conta[]> {
  const response = await apiClient.get<Conta[]>('/contas');
  return response.data;
}

export async function getContaById(id: string): Promise<Conta> {
  const response = await apiClient.get<Conta>(`/contas/${id}`);
  return response.data;
}

export async function createConta(data: CreateContaPayload): Promise<Conta> {
  const response = await apiClient.post<Conta>('/contas', data);
  return response.data;
}

export async function updateConta(data: UpdateContaPayload): Promise<Conta> {
  const response = await apiClient.put<Conta>(`/contas/${data.id}`, data);
  return response.data;
}

export async function deleteConta(id: string): Promise<void> {
  await apiClient.delete(`/contas/${id}`);
}
