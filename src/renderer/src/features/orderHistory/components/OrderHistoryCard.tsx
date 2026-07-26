import { OrderDoc } from '@renderer/types/order';
import { formatMoney } from '@renderer/global/utils/formatMoney';

const statusStyles: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  delivered: 'bg-green-50 text-green-700',
  collected: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  order: OrderDoc;
  onClick: () => void;
}

function OrderHistoryCard({ order, onClick }: Props) {
  const itemsSummary =
    order.lineItems && order.lineItems.length > 0
      ? order.lineItems.map((item) => `${item.quantity}x ${item.name}`).join(', ')
      : 'Order details unavailable';

  const statusClass = statusStyles[order.orderStatus] ?? 'bg-gray-100 text-gray-600';

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between rounded-xl border border-border bg-white p-4 cursor-pointer hover:border-primary/40">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">#{order.orderNumber}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`}>
            {order.orderStatus}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">{itemsSummary}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
      </div>

      <p className="text-sm font-semibold whitespace-nowrap ml-3">
        {formatMoney(order.bill?.total ?? 0)}
      </p>
    </div>
  );
}

export default OrderHistoryCard;
