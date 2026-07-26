import { useEffect } from 'react';
import { subscribeToAdminSettings } from '../services/adminSettingsService';
import { useAdminSettingsStore } from '../store/useAdminSettingsStore';

export function useAdminSettingsListener() {
  const setSettings = useAdminSettingsStore((state) => state.setSettings);

  useEffect(() => {
    const unsubscribe = subscribeToAdminSettings(
      (settings) => setSettings(settings),
      (error) => console.error('Failed to load admin settings:', error),
    );

    return () => unsubscribe();
  }, [setSettings]);
}
