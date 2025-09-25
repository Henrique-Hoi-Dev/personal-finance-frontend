export interface Conta {
  id: string;
  nome: string;
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'cartao';
  saldo: number;
  cor: string;
  icone: string;
  ativa: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaPayload {
  nome: string;
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'cartao';
  saldo: number;
  cor: string;
  icone: string;
}

export interface UpdateContaPayload {
  id: string;
  nome?: string;
  tipo?: 'corrente' | 'poupanca' | 'investimento' | 'cartao';
  saldo?: number;
  cor?: string;
  icone?: string;
  ativa?: boolean;
}
