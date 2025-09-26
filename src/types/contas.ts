export interface Conta {
  id: string;
  name: string;
  type: 'FIXED' | 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
  totalAmount: number;
  installments?: number;
  startDate: string;
  dueDay: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaPayload {
  userId: string;
  name: string;
  type: 'FIXED' | 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
  totalAmount: number;
  installments: number;
  startDate: string;
  dueDay: number;
}

export interface UpdateContaPayload {
  id: string;
  name?: string;
  type?: 'FIXED' | 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
  totalAmount?: number;
  installments?: number;
  startDate?: string;
  dueDay?: number;
}
