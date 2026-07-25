import { toast } from 'sonner';
import { OrderDoc } from '@renderer/types/order';
import { formatMoney } from '@renderer/utils/formatMoney';

const actionLabel: Record<OrderDoc['orderStatus'], string> = {
  placed: 'Accept',
  preparing: 'Mark ready',
  ready: 'Dispatch',
  out_for_delivery: 'Mark delivered',
  completed: 'View',
  cancelled: 'View',
};

function minutesAgo(timestamp: number): number {
  const diff = Date.now() - timestamp;
  return Math.floor(diff / 60000);
}

interface Props {
  order: OrderDoc;
  onClick: () => void;
  onAction: () => void;
  onReject?: () => void;
}

function OrderCard({ order, onClick, onAction, onReject }: Props) {
  const minsAgo = minutesAgo(order.createdAt);
  const isNew = order.orderStatus === 'placed';
  const isUrgent = isNew && minsAgo > 5;

  function handleAcceptClick(e: React.MouseEvent): void {
    e.stopPropagation();
    onAction();
    toast.success(`Order #${order.orderNumber} updated`);
  }

  function handleRejectClick(e: React.MouseEvent): void {
    e.stopPropagation();
    if (onReject) {
      onReject();
    }
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer ${
        isUrgent ? 'border-error-bg bg-error-bg' : 'border-border bg-white'
      }`}>
      <div>
        <p className="text-sm font-medium">#{order.orderNumber}</p>
        <p className="text-xs text-gray-500 mt-1">
          {order.lineItems.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {order.orderType} · {minsAgo} min ago · {formatMoney(order.bill.total)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isNew && onReject && (
          <button
            onClick={handleRejectClick}
            className="px-4 py-2 rounded-md border border-border text-text-secondary text-sm font-medium hover:bg-surface cursor-pointer">
            Reject
          </button>
        )}
        <button
          onClick={handleAcceptClick}
          className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark cursor-pointer">
          {actionLabel[order.orderStatus]}
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
