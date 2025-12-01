import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PluggyItem } from '@/types/pluggy';

interface PluggyState {
  hasBankConnected: boolean;
  items: PluggyItem[];
  addItem: (item: PluggyItem) => void;
  removeItem: (itemId: string) => void;
  setHasBankConnected: (status: boolean) => void;
  clearItems: () => void;
}

export const usePluggyStore = create<PluggyState>()(
  persist(
    (set) => ({
      hasBankConnected: false,
      items: [],

      addItem: (item) =>
        set((state) => {
          // Verifica se o item já existe
          const itemExists = state.items.some((i) => i.id === item.id);
          if (itemExists) {
            return state;
          }

          return {
            items: [...state.items, item],
            hasBankConnected: true,
          };
        }),

      removeItem: (itemId) =>
        set((state) => {
          const filteredItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: filteredItems,
            hasBankConnected: filteredItems.length > 0,
          };
        }),

      setHasBankConnected: (status) => set({ hasBankConnected: status }),

      clearItems: () =>
        set({
          items: [],
          hasBankConnected: false,
        }),
    }),
    {
      name: 'pluggy-storage',
      partialize: (state) => ({
        hasBankConnected: state.hasBankConnected,
        items: state.items,
      }),
    }
  )
);
