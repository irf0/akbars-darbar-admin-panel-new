import { AdminSettings } from '@renderer/types/admin';
import { create } from 'zustand';

interface AdminSettingsStore {
  settings: AdminSettings | null;
  isLoading: boolean;
  setSettings: (settings: AdminSettings) => void;
}

export const useAdminSettingsStore = create<AdminSettingsStore>((set) => ({
  settings: null,
  isLoading: true,
  setSettings: (settings) => set({ settings, isLoading: false }),
}));
