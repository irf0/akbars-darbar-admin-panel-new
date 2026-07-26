import { AdminSettings } from '@renderer/types/admin';

type OrderType = 'delivery' | 'takeaway';
type Portion = 'half' | 'full';

interface PriceableItem {
  base_half_price: number;
  base_full_price: number;
}

export function getPriceForPortion(
  item: PriceableItem,
  portion: Portion,
  orderType: OrderType,
  settings: AdminSettings,
): number {
  const basePrice = portion === 'half' ? item.base_half_price : item.base_full_price;

  const markup =
    orderType === 'delivery'
      ? settings.deliveryMenuHikePercentage
      : settings.takeawayMenuHikePercentage;

  return Math.round(basePrice * (1 + markup / 100));
}
