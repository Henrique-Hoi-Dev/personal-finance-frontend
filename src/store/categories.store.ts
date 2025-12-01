import { create } from 'zustand';
import { getCategories } from '@/services/transacoes.service';
import { Category } from '@/types/transacoes';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface CategoriesActions {
  fetchCategories: () => Promise<void>;
  getCategoriesByType: (type: 'INCOME' | 'EXPENSE') => Category[];
  clearError: () => void;
}

type CategoriesStore = CategoriesState & CategoriesActions;

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  // State
  categories: [],
  loading: false,
  error: null,

  // Actions
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getCategories();
      set({
        categories: Array.isArray(categories) ? categories : [],
        loading: false,
      });
    } catch (error: any) {
      set({
        categories: [], // Mantém array vazio em caso de erro
        error: error.message || 'Erro ao carregar categorias',
        loading: false,
      });
    }
  },

  getCategoriesByType: (type: 'INCOME' | 'EXPENSE') => {
    const { categories } = get();
    return categories.filter((category) => category.type === type);
  },

  clearError: () => set({ error: null }),
}));
