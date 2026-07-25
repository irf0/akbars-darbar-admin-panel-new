export interface LineItem {
  id: string;
  name: string;
  portion: string;
  quantity: number;
  unitPrice: number; // in paise
  lineTotal: number; // in paise
}

export interface Bill {
  itemsSubtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  deliveryCharge: number;
  packingCharge: number;
  platformFee: number;
  discount: number;
  total: number;
}

export type OrderStatus =
  'placed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export type OrderType = 'delivery' | 'takeaway';
export type PaymentStatus = 'cod_pending' | 'paid' | 'failed' | 'refunded';

export interface OrderDoc {
  id: string;
  orderNumber: string;
  uid: string;
  orderStatus: OrderStatus;
  orderType: OrderType;
  paymentStatus: PaymentStatus;
  currency: string;
  bill: Bill;
  lineItems: LineItem[];
  addressId: string | null;
  cookingInstructions: string | null;
  deliveryInstructions: string | null;
  deliveryOtp: string | null;
  takeawaySlot: string | null;
  appliedCoupon: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  cancellationReason?: string | null;
  riderName?: string | null;
  riderMapsLink?: string | null;
  createdAt: number;
}

export interface Customer {
  name: string;
  phone: string;
}

export interface Address {
  label: string;
  line1: string;
  line2?: string;
  landmark?: string;
  latitude: number;
  longitude: number;
}

export const rejectionReasons = [
  'Item out of stock',
  'Kitchen too busy',
  'Restaurant closing soon',
  'Unable to deliver to this address',
  'Other',
] as const;
