import { Address } from '@renderer/types/order';

export function buildMapsLink(address: Address): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`;
}
