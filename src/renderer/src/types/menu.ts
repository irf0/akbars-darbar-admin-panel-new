export type ItemType = 'Veg' | 'Non-Veg';
export type PortionType = 'half' | 'full' | null;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  item_type: ItemType;
  image: string;
  available: boolean;
  availableAt: string;
  bestSeller: boolean;
  isOutOfStock: boolean;
  showPortionName?: boolean;
  halfPortion?: string;
  fullPortion?: string;
  base_full_price: number; //new added in v2
  base_half_price: number;
}
