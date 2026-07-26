export interface AdminSettings {
  cgstRate: number;
  sgstRate: number;
  closingTime: string;
  openingTime: string;
  deliveryCharge: number;
  deliveryDiscountPercentage: number;
  deliveryEnabled: boolean;
  deliveryMenuHikePercentage: number;
  discountPercentage: number;
  hikedPercentage: number;
  isCODEnabled: boolean;
  isShopClosed: boolean;
  packingCharge: number;
  platformFee?: number;
  restaurantLat: number;
  restaurantLng: number;
  takeawayDiscountPercentage: number;
  takeawayEnabled: boolean;
  takeawayMenuHikePercentage: number;
}
