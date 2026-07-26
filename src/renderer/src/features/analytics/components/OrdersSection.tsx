import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { OrdersBreakdown } from '@renderer/global/services/analyticsService';

interface Props {
  data: OrdersBreakdown | null;
}

const COLORS = ['#A90303', '#E5A5A5'];

function OrdersSection({ data }: Props) {
  if (!data) return null;

  const pieData = data.byOrderType.map((item) => ({ name: item.label, value: item.count }));
  const totalOrders = data.byOrderType.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold mb-4">Orders</h2>

      <div className="grid grid-cols-2 gap-6 mb-5 pb-5 border-b border-border">
        <div>
          <p className="text-xs text-text-secondary mb-2">Order type</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5">
              {pieData.map((entry, index) => {
                const percent = totalOrders > 0 ? Math.round((entry.value / totalOrders) * 100) : 0;
                return (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="capitalize">{entry.name}</span>
                    <span className="text-text-secondary">
                      {entry.value} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs text-text-secondary mb-1">Total orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>
      </div>

      <p className="text-xs text-text-secondary mb-3">Peak hours</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data.peakHours}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="orderCount" fill="#A90303" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrdersSection;
