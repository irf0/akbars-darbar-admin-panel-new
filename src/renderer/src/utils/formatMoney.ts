export function formatMoney(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}
