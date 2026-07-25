import { create } from 'zustand';
import { OrderDoc, OrderStatus } from '@renderer/types/order';

interface OrdersStore {
  orders: OrderDoc[];
  activeTab: OrderStatus;
  selectedOrderId: string | null;
  setOrders: (orders: OrderDoc[]) => void;
  setActiveTab: (tab: OrderStatus) => void;
  selectOrder: (id: string | null) => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  activeTab: 'placed',
  selectedOrderId: null,
  setOrders: (orders) => set({ orders }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectOrder: (id) => set({ selectedOrderId: id }),
}));
