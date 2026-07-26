import { create } from 'zustand';
import { Rider } from '@renderer/types/rider';

interface RidersStore {
  riders: Rider[];
  isLoading: boolean;
  setRiders: (riders: Rider[]) => void;
}

export const useRidersStore = create<RidersStore>((set) => ({
  riders: [],
  isLoading: false,
  setRiders: (riders) => set({ riders, isLoading: false }),
}));
