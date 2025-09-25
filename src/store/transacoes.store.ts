import { create } from 'zustand';
import {
  getTransacoes,
  getTransacaoById,
  createTransacao,
  updateTransacao,
  deleteTransacao,
  getTransacoesByConta,
} from '@/services/transacoes.service';
import {
  Transacao,
  CreateTransacaoPayload,
  UpdateTransacaoPayload,
  TransacaoFilters,
} from '@/types/transacoes';

interface TransacoesState {
  transacoes: Transacao[];
  selectedTransacao: Transacao | null;
  loading: boolean;
  error: string | null;
  filters: TransacaoFilters;
}

interface TransacoesActions {
  fetchTransacoes: (filters?: TransacaoFilters) => Promise<void>;
  fetchTransacaoById: (id: string) => Promise<void>;
  fetchTransacoesByConta: (contaId: string) => Promise<void>;
  addTransacao: (data: CreateTransacaoPayload) => Promise<void>;
  updateTransacao: (data: UpdateTransacaoPayload) => Promise<void>;
  removeTransacao: (id: string) => Promise<void>;
  setSelectedTransacao: (transacao: Transacao | null) => void;
  setFilters: (filters: TransacaoFilters) => void;
  clearError: () => void;
}

type TransacoesStore = TransacoesState & TransacoesActions;

export const useTransacoesStore = create<TransacoesStore>((set, get) => ({
  // State
  transacoes: [],
  selectedTransacao: null,
  loading: false,
  error: null,
  filters: {},

  // Actions
  fetchTransacoes: async (filters?: TransacaoFilters) => {
    set({ loading: true, error: null });
    try {
      const transacoes = await getTransacoes(filters);
      set({
        transacoes,
        filters: filters || {},
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar transações',
        loading: false,
      });
    }
  },

  fetchTransacaoById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const transacao = await getTransacaoById(id);
      set({ selectedTransacao: transacao, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar transação',
        loading: false,
      });
    }
  },

  fetchTransacoesByConta: async (contaId: string) => {
    set({ loading: true, error: null });
    try {
      const transacoes = await getTransacoesByConta(contaId);
      set({ transacoes, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar transações da conta',
        loading: false,
      });
    }
  },

  addTransacao: async (data: CreateTransacaoPayload) => {
    set({ loading: true, error: null });
    try {
      const novaTransacao = await createTransacao(data);
      set((state) => ({
        transacoes: [novaTransacao, ...state.transacoes],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao criar transação',
        loading: false,
      });
      throw error;
    }
  },

  updateTransacao: async (data: UpdateTransacaoPayload) => {
    set({ loading: true, error: null });
    try {
      const transacaoAtualizada = await updateTransacao(data);
      set((state) => ({
        transacoes: state.transacoes.map((transacao) =>
          transacao.id === data.id ? transacaoAtualizada : transacao
        ),
        selectedTransacao:
          state.selectedTransacao?.id === data.id
            ? transacaoAtualizada
            : state.selectedTransacao,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar transação',
        loading: false,
      });
      throw error;
    }
  },

  removeTransacao: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteTransacao(id);
      set((state) => ({
        transacoes: state.transacoes.filter((transacao) => transacao.id !== id),
        selectedTransacao:
          state.selectedTransacao?.id === id ? null : state.selectedTransacao,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao deletar transação',
        loading: false,
      });
      throw error;
    }
  },

  setSelectedTransacao: (transacao: Transacao | null) =>
    set({ selectedTransacao: transacao }),

  setFilters: (filters: TransacaoFilters) => set({ filters }),

  clearError: () => set({ error: null }),
}));
