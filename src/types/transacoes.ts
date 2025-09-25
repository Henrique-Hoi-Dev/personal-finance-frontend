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
}
