import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendPoint,
  OrderTypeAndPaymentBreakdown,
} from '@renderer/global/services/analyticsService';
import { formatRupees } from '@renderer/global/utils/formatRupees';
import BreakdownBars from './BreakdownBars';

interface Props {
  trend: TrendPoint[];
  breakdowns: OrderTypeAndPaymentBreakdown | null;
}

function RevenueSection({ trend, breakdowns }: Props) {
  if (trend.length === 0) return null;

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold mb-4">Revenue</h2>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => formatRupees(Number(value))} />
          <Line type="monotone" dataKey="revenue" stroke="#A90303" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {breakdowns && (
        <div className="grid grid-cols-2 gap-6 mt-5 pt-5 border-t border-border">
          <div>
            <p className="text-xs text-text-secondary mb-3">By order type</p>
            <BreakdownBars items={breakdowns.byOrderType} />
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-3">By payment status</p>
            <BreakdownBars items={breakdowns.byPaymentType} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RevenueSection;
