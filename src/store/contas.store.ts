import { create } from 'zustand';
import {
  getContas,
  getContaById,
  createConta,
  updateConta,
  deleteConta,
} from '@/services/contas.service';
import { Conta, CreateContaPayload, UpdateContaPayload } from '@/types/contas';
import { useAuthStore } from './auth.store';

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
  updateInstallmentStatus: (
    contaId: string,
    installmentId: string,
    isPaid: boolean
  ) => void;
  updateContaTotalAmount: (contaId: string, newTotalAmount: number) => void;
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
      const contas = await getContas({});
      set({ contas, loading: false });
    } catch (error: any) {
      set({ contas: [], loading: false });
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

  addConta: async (data: Omit<CreateContaPayload, 'userId'>) => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const contaData: CreateContaPayload = {
        ...data,
        userId: user.id,
      };

      const novaConta = await createConta(contaData);
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

  updateInstallmentStatus: (
    contaId: string,
    installmentId: string,
    isPaid: boolean
  ) => {
    set((state) => ({
      contas: state.contas.map((conta) =>
        conta.id === contaId
          ? {
              ...conta,
              installmentList: conta.installmentList?.map((installment) =>
                installment.id === installmentId
                  ? {
                      ...installment,
                      isPaid,
                      paidAt: isPaid ? new Date().toISOString() : null,
                    }
                  : installment
              ),
            }
          : conta
      ),
      selectedConta:
        state.selectedConta?.id === contaId
          ? {
              ...state.selectedConta,
              installmentList: state.selectedConta.installmentList?.map(
                (installment) =>
                  installment.id === installmentId
                    ? {
                        ...installment,
                        isPaid,
                        paidAt: isPaid ? new Date().toISOString() : null,
                      }
                    : installment
              ),
            }
          : state.selectedConta,
    }));
  },

  updateContaTotalAmount: (contaId: string, newTotalAmount: number) => {
    set((state) => ({
      contas: state.contas.map((conta) =>
        conta.id === contaId ? { ...conta, totalAmount: newTotalAmount } : conta
      ),
      selectedConta:
        state.selectedConta?.id === contaId
          ? { ...state.selectedConta, totalAmount: newTotalAmount }
          : state.selectedConta,
    }));
  },

  clearError: () => set({ error: null }),
}));
