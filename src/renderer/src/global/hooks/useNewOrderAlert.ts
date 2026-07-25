import { useEffect, useRef } from 'react';
import { useOrdersStore } from '@features/orders/store/useOrdersStore';
import { useOrderAlertStore } from '../store/useOrderAlertStore';
import alertSound from '@renderer/assets/alert.mp3';

export function useNewOrderAlert() {
  const orders = useOrdersStore((state) => state.orders);
  const seenOrderIds = useOrderAlertStore((state) => state.seenOrderIds);

  const unacknowledgedOrders = orders.filter(
    (order) => order.orderStatus === 'placed' && !seenOrderIds.has(order.id),
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(alertSound);
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;

    if (unacknowledgedOrders.length > 0) {
      audio.play().catch(() => {
        // Playback blocked (rare in Electron, but possible) — the visual banner
        // still shows regardless, so staff aren't relying on sound alone.
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [unacknowledgedOrders.length]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return { unacknowledgedOrders };
}
