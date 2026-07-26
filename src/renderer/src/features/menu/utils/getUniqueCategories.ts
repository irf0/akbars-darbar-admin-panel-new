import { MenuItem } from '@renderer/types/menu';

export function getUniqueCategories(items: MenuItem[]): string[] {
  return Array.from(new Set(items.map((item) => item.category)))
    .filter(Boolean)
    .sort();
}

export function getUniqueSubCategories(items: MenuItem[], category: string): string[] {
  return Array.from(
    new Set(items.filter((item) => item.category === category).map((item) => item.subCategory)),
  )
    .filter(Boolean)
    .sort();
}
