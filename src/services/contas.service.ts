import { apiClient } from './apiClient';
import { Conta, CreateContaPayload, UpdateContaPayload } from '@/types/contas';

// Types for installments
export interface Installment {
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

export async function getContas(): Promise<Conta[]> {
  const response = await apiClient.get<Conta[]>('/accounts');
  return response.data;
}

export async function getContaById(id: string): Promise<Conta> {
  const response = await apiClient.get<Conta>(`/accounts/${id}`);
  return response.data;
}

export async function createConta(data: CreateContaPayload): Promise<Conta> {
  const response = await apiClient.post<Conta>('/accounts', data);
  return response.data;
}

export async function updateConta(data: UpdateContaPayload): Promise<Conta> {
  const { id, ...updateData } = data;
  const response = await apiClient.patch<Conta>(`/accounts/${id}`, updateData);
  return response.data;
}

export async function deleteConta(id: string): Promise<void> {
  await apiClient.delete(`/accounts/${id}`);
}

// Installment endpoints for specific account
export async function getAccountInstallments(
  accountId: string,
  params?: GetInstallmentsParams
): Promise<{
  data: Installment[];
  total: number;
  page: number;
  limit: number;
}> {
  const response = await apiClient.get<{
    data: Installment[];
    total: number;
    page: number;
    limit: number;
  }>(`/accounts/${accountId}/installments`, { params });
  return response.data;
}

export async function createAccountInstallment(
  accountId: string,
  data: CreateInstallmentPayload
): Promise<Installment> {
  const response = await apiClient.post<Installment>(
    `/accounts/${accountId}/installments`,
    data
  );
  return response.data;
}

// General installment endpoints
export async function getAllInstallments(
  params?: GetAllInstallmentsParams
): Promise<{
  data: Installment[];
  total: number;
  page: number;
  limit: number;
}> {
  const response = await apiClient.get<{
    data: Installment[];
    total: number;
    page: number;
    limit: number;
  }>('/accounts/installments', { params });
  return response.data;
}

export async function getInstallmentById(id: string): Promise<Installment> {
  const response = await apiClient.get<Installment>(
    `/accounts/installments/${id}`
  );
  return response.data;
}

export async function unpayInstallment(id: string): Promise<Installment> {
  const response = await apiClient.patch<Installment>(
    `/accounts/installments/${id}/unpay`
  );
  return response.data;
}

export async function deleteInstallment(id: string): Promise<void> {
  await apiClient.delete(`/accounts/installments/${id}`);
}

// Payment functions
export async function payInstallment(
  installmentId: string,
  paymentAmount: number
): Promise<Installment> {
  const response = await apiClient.patch<Installment>(
    `/accounts/installments/${installmentId}/pay`,
    { paymentAmount }
  );
  return response.data;
}

export async function payFullAccount(
  accountId: string,
  paymentAmount: number
): Promise<Conta> {
  const response = await apiClient.patch<Conta>(`/accounts/${accountId}/pay`, {
    paymentAmount,
  });
  return response.data;
}
