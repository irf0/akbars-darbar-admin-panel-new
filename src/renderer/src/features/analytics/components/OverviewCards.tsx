import { AnalyticsSummary } from '@renderer/global/services/analyticsService';
import { formatRupees } from '@renderer/global/utils/formatRupees';

interface Props {
  summary: AnalyticsSummary;
}

function OverviewCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white border border-border rounded-xl p-5">
        <p className="text-xs text-text-secondary mb-1">Revenue</p>
        <p className="text-2xl font-semibold">{formatRupees(summary.revenue)}</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-5">
        <p className="text-xs text-text-secondary mb-1">Orders</p>
        <p className="text-2xl font-semibold">{summary.orderCount}</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-5">
        <p className="text-xs text-text-secondary mb-1">Avg order value</p>
        <p className="text-2xl font-semibold">{formatRupees(summary.avgOrderValue)}</p>
      </div>
    </div>
  );
}

export default OverviewCards;
