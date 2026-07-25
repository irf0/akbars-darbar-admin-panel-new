import { OrderDoc } from '@renderer/types/order';

export const printKOT = (order: OrderDoc) => {
  // TODO: wire to actual thermal printer in Phase 3
  console.log('Printing KOT for order:', order.orderNumber);
  console.log(
    order.lineItems.map((item) => `${item.quantity}x ${item.name} (${item.portion})`).join('\n'),
  );
};
