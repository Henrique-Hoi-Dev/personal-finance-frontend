import { create } from 'zustand';
import {
  getContas,
  getContaById,
  createConta,
  updateConta,
  deleteConta,
} from '@/services/contas.service';
import { Conta, CreateContaPayload, UpdateContaPayload } from '@/types/contas';

interface ContasState {
  contas: Conta[];
  selectedConta: Conta | null;
  loading: boolean;
  error: string | null;
}

interface ContasActions {
  fetchContas: () => Promise<void>;
  fetchContaById: (id: string) => Promise<void>;
  addConta: (data: CreateContaPayload) => Promise<void>;
  updateConta: (data: UpdateContaPayload) => Promise<void>;
  removeConta: (id: string) => Promise<void>;
  setSelectedConta: (conta: Conta | null) => void;
  clearError: () => void;
}

type ContasStore = ContasState & ContasActions;

export const useContasStore = create<ContasStore>((set, get) => ({
  // State
  contas: [],
  selectedConta: null,
  loading: false,
  error: null,

  // Actions
  fetchContas: async () => {
    set({ loading: true, error: null });
    try {
      const contas = await getContas();
      set({ contas, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar contas',
        loading: false,
      });
    }
  },

  fetchContaById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const conta = await getContaById(id);
      set({ selectedConta: conta, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar conta',
        loading: false,
      });
    }
  },

  addConta: async (data: CreateContaPayload) => {
    set({ loading: true, error: null });
    try {
      const novaConta = await createConta(data);
      set((state) => ({
        contas: [...state.contas, novaConta],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao criar conta',
        loading: false,
      });
      throw error;
    }
  },

  updateConta: async (data: UpdateContaPayload) => {
    set({ loading: true, error: null });
    try {
      const contaAtualizada = await updateConta(data);
      set((state) => ({
        contas: state.contas.map((conta) =>
          conta.id === data.id ? contaAtualizada : conta
        ),
        selectedConta:
          state.selectedConta?.id === data.id
            ? contaAtualizada
            : state.selectedConta,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar conta',
        loading: false,
      });
      throw error;
    }
  },

  removeConta: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteConta(id);
      set((state) => ({
        contas: state.contas.filter((conta) => conta.id !== id),
        selectedConta:
          state.selectedConta?.id === id ? null : state.selectedConta,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao deletar conta',
        loading: false,
      });
      throw error;
    }
  },

  setSelectedConta: (conta: Conta | null) => set({ selectedConta: conta }),

  clearError: () => set({ error: null }),
}));
