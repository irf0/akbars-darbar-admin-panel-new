import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { PopularItem } from '@renderer/global/services/analyticsService';

interface Props {
  items: PopularItem[];
}

const BAR_SHADES = ['#A90303', '#BC2E2E', '#CE5959', '#E08585', '#F2B0B0'];

function MenuPerformanceSection({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4">Menu performance</h2>
        <p className="text-sm text-text-secondary">No items sold in this period</p>
      </div>
    );
  }

  const chartData = [...items].reverse(); // recharts vertical bars render bottom-to-top

  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold mb-4">Top selling items</h2>

      <ResponsiveContainer width="100%" height={items.length * 44}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} interval={0} />
          <Tooltip formatter={(value) => [`${value} sold`, '']} labelFormatter={() => ''} />
          <Bar dataKey="quantitySold" radius={[0, 6, 6, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={BAR_SHADES[(items.length - 1 - index) % BAR_SHADES.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MenuPerformanceSection;
