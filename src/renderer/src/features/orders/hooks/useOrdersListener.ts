import { useEffect } from 'react';
import { subscribeToOrders } from '@renderer/global/services/orderService';
import { useOrdersStore } from '../store/useOrdersStore';

export const useOrdersListener = () => {
  const setOrders = useOrdersStore((state) => state.setOrders);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (orders) => {
        setOrders(orders);
      },
      (error) => {
        console.error('Failed to load orders:', error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [setOrders]);
};
