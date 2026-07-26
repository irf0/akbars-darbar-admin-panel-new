import { useEffect } from 'react';
import { subscribeToMenu } from '@renderer/global/services/menuService';
import { useMenuStore } from '../store/useMenuStore';

export function useMenuListener() {
  const setItems = useMenuStore((state) => state.setItems);

  useEffect(() => {
    const unsubscribe = subscribeToMenu(
      (items) => setItems(items),
      (error) => console.error('Failed to load menu:', error),
    );

    return () => unsubscribe();
  }, [setItems]);
}
