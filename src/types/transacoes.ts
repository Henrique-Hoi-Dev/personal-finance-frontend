export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  contaId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransacaoPayload {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  contaId: string;
}

export interface UpdateTransacaoPayload {
  id: string;
  descricao?: string;
  valor?: number;
  tipo?: 'receita' | 'despesa';
  categoria?: string;
  data?: string;
  contaId?: string;
}

export interface TransacaoFilters {
  tipo?: 'receita' | 'despesa';
  categoria?: string;
  contaId?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  color?: string;
  icon?: string;
}

export interface CreateIncomePayload {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  contaId: string;
}

export interface CreateExpensePayload {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  contaId: string;
}
