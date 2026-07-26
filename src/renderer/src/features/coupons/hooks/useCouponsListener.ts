import { useEffect } from 'react';
import { subscribeToCoupons } from '@renderer/global/services/couponService';
import { useCouponsStore } from '../store/useCouponsStore';

export function useCouponsListener() {
  const setCoupons = useCouponsStore((state) => state.setCoupons);

  useEffect(() => {
    const unsubscribe = subscribeToCoupons(
      (coupons) => setCoupons(coupons),
      (error) => console.error('Failed to load coupons:', error),
    );

    return () => unsubscribe();
  }, [setCoupons]);
}
