import { create } from 'zustand';
import { OrderDoc } from '@renderer/types/order';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface OrderHistoryStore {
  orders: OrderDoc[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
  isLoading: boolean;
  isSearchMode: boolean;
  setPage: (
    orders: OrderDoc[],
    lastDoc: QueryDocumentSnapshot<DocumentData> | null,
    hasMore: boolean,
    append: boolean,
  ) => void;
  setLoading: (loading: boolean) => void;
  setSearchResults: (orders: OrderDoc[]) => void;
  reset: () => void;
}

export const useOrderHistoryStore = create<OrderHistoryStore>((set, get) => ({
  orders: [],
  lastDoc: null,
  hasMore: true,
  isLoading: false,
  isSearchMode: false,
  setPage: (newOrders, lastDoc, hasMore, append) =>
    set({
      orders: append ? [...get().orders, ...newOrders] : newOrders,
      lastDoc,
      hasMore,
      isSearchMode: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchResults: (orders) => set({ orders, isSearchMode: true, hasMore: false }),
  reset: () => set({ orders: [], lastDoc: null, hasMore: true, isSearchMode: false }),
}));
