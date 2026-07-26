import { create } from 'zustand';
import { Coupon } from '@renderer/types/coupon';

interface CouponsStore {
  coupons: Coupon[];
  isLoading: boolean;
  setCoupons: (coupons: Coupon[]) => void;
}

export const useCouponsStore = create<CouponsStore>((set) => ({
  coupons: [],
  isLoading: true,
  setCoupons: (coupons) => set({ coupons, isLoading: false }),
}));
