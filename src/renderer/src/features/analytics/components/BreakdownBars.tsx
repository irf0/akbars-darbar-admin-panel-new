import { formatRupees } from '@renderer/global/utils/formatRupees';

interface BreakdownItem {
  label: string;
  revenue: number;
}

interface Props {
  items: BreakdownItem[];
}

function BreakdownBars({ items }: Props) {
  const total = items.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const percent = total > 0 ? (item.revenue / total) * 100 : 0;

        return (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize">{item.label.replace('_', ' ')}</span>
              <span className="text-text-secondary">{formatRupees(item.revenue)}</span>
            </div>
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BreakdownBars;
