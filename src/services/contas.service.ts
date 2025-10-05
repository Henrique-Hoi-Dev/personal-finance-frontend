import { apiClient } from './apiClient';
import {
  Conta,
  CreateContaPayload,
  UpdateContaPayload,
  InstallmentService,
  CreateInstallmentPayload,
  GetInstallmentsParams,
  GetAllInstallmentsParams,
  PaginatedResponse,
  PeriodAccountsResponse,
  GetPeriodAccountsParams,
  MonthlyComparisonResponse,
  DashboardAllResponse,
  GetContasParams,
} from '@/types/contas';

export async function getContas(params: GetContasParams): Promise<Conta[]> {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );

  const queryString = new URLSearchParams();
  Object.entries(filteredParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryString.append(key, String(value));
    }
  });

  const endpoint = queryString.toString()
    ? `/accounts?${queryString.toString()}`
    : '/accounts';

  const response = await apiClient.get<Conta[]>(endpoint);
  return response.data;
}

export async function getPeriodAccounts(
  params: GetPeriodAccountsParams
): Promise<PeriodAccountsResponse> {
  // Filtrar parâmetros undefined/null/empty
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );

  const response = await apiClient.get<PeriodAccountsResponse>(
    '/v1/accounts/period/accounts',
    filteredParams
  );
  return response.data;
}

export async function getMonthlyComparison(params?: {
  limit?: number;
  page?: number;
}): Promise<MonthlyComparisonResponse> {
  const response = await apiClient.get<MonthlyComparisonResponse>(
    '/v1/accounts/reports/monthly-summary',
    params
  );
  return response.data;
}

export async function getDashboardAll(): Promise<DashboardAllResponse> {
  const response = await apiClient.get<DashboardAllResponse>(
    '/v1/accounts/dashboard/all'
  );
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
): Promise<PaginatedResponse<InstallmentService>> {
  const response = await apiClient.get<PaginatedResponse<InstallmentService>>(
    `/accounts/${accountId}/installments`,
    { params }
  );
  return response.data;
}

export async function createAccountInstallment(
  accountId: string,
  data: CreateInstallmentPayload
): Promise<InstallmentService> {
  const response = await apiClient.post<InstallmentService>(
    `/accounts/${accountId}/installments`,
    data
  );
  return response.data;
}

// General installment endpoints
export async function getAllInstallments(
  params?: GetAllInstallmentsParams
): Promise<PaginatedResponse<InstallmentService>> {
  const response = await apiClient.get<PaginatedResponse<InstallmentService>>(
    '/accounts/installments',
    { params }
  );
  return response.data;
}

export async function getInstallmentById(
  id: string
): Promise<InstallmentService> {
  const response = await apiClient.get<InstallmentService>(
    `/accounts/installments/${id}`
  );
  return response.data;
}

export async function unpayInstallment(
  id: string
): Promise<InstallmentService> {
  const response = await apiClient.patch<InstallmentService>(
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
): Promise<InstallmentService> {
  const response = await apiClient.patch<InstallmentService>(
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
