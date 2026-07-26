import { useEffect } from 'react';
import { subscribeToRiders } from '@renderer/global/services/riderService';
import { useRidersStore } from '../store/useRidersStore';

export function useRidersListener() {
  const setRiders = useRidersStore((state) => state.setRiders);

  useEffect(() => {
    const unsubscribe = subscribeToRiders(
      (riders) => setRiders(riders),
      (error) => console.error('Failed to load riders:', error),
    );

    return () => unsubscribe();
  }, [setRiders]);
}
