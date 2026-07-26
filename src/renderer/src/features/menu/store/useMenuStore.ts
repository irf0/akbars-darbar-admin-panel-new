import { create } from 'zustand';
import { MenuItem } from '@renderer/types/menu';

interface MenuStore {
  items: MenuItem[];
  isLoading: boolean;
  setItems: (items: MenuItem[]) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  items: [],
  isLoading: true,
  setItems: (items) => set({ items, isLoading: false }),
}));
