export interface Installment {
  id: string;
  amount: number;
  number: number;
  dueDate: string;
  isPaid: boolean;
  paidAt: string | null;
}

export interface Conta {
  id: string;
  name: string;
  type: 'FIXED' | 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
  totalAmount: number;
  installments?: number;
  installmentAmount?: number;
  totalWithInterest?: number;
  interestRate?: number;
  monthlyInterestRate?: number;
  amountPaid?: number;
  isPreview?: boolean;
  startDate: string;
  isPaid: boolean;
  dueDay: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  installmentList?: Installment[];
}

export interface CreateContaPayload {
  userId: string;
  name: string;
  type: 'FIXED' | 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
  totalAmount: number;
  installments?: number;
  installmentAmount?: number;
  isPreview?: boolean;
  startDate: string;
  dueDay: number;
}

export interface UpdateContaPayload {
  id: string;
  name?: string;
  type?: 'FIXED' | 'LOAN' | 'CREDIT_CARD' | 'SUBSCRIPTION' | 'OTHER';
  totalAmount?: number;
  installments?: number;
  isPreview?: boolean;
  startDate?: string;
  dueDay?: number;
}
