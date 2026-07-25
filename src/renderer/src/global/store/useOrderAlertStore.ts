import { create } from 'zustand';

interface OrderAlertStore {
  seenOrderIds: Set<string>;
  markSeen: (ids: string[]) => void;
}

export const useOrderAlertStore = create<OrderAlertStore>((set, get) => ({
  seenOrderIds: new Set(),
  markSeen: (ids) => {
    const updated = new Set(get().seenOrderIds);
    ids.forEach((id) => updated.add(id));
    set({ seenOrderIds: updated });
  },
}));
