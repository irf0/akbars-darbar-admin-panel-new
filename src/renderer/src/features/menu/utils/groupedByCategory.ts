import { MenuItem } from '@renderer/types/menu';

export function groupByCategory(items: MenuItem[]): Record<string, Record<string, MenuItem[]>> {
  const grouped: Record<string, Record<string, MenuItem[]>> = {};

  items.forEach((item) => {
    const category = item.category || 'Uncategorized';
    const subCategory = item.subCategory || 'General';

    if (!grouped[category]) grouped[category] = {};
    if (!grouped[category][subCategory]) grouped[category][subCategory] = [];

    grouped[category][subCategory].push(item);
  });

  return grouped;
}
