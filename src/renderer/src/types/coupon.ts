export type CouponType = 'percentage' | 'flat';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  active: boolean;
}
