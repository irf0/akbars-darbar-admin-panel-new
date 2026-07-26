import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { fetchCustomer } from '@renderer/global/services/customerService';
import { fetchOrderById } from '@renderer/global/services/orderService';
import { OrderDoc } from '@renderer/types/order';
import { Review } from '@renderer/types/reviews';

interface Props {
  review: Review;
}

function ReviewCard({ review }: Props) {
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDetails(): Promise<void> {
      setLoading(true);
      try {
        const [customer, orderData] = await Promise.all([
          fetchCustomer(review.uid),
          fetchOrderById(review.orderId),
        ]);

        if (!cancelled) {
          setCustomerName(customer?.name ?? 'Unknown customer');
          setOrder(orderData);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [review.uid, review.orderId]);

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">{loading ? 'Loading...' : customerName}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? 'fill-primary text-primary' : 'text-border'}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-2">{review.text}</p>

      {!loading && order && (
        <div className="border-t border-border pt-2 mt-2">
          <p className="text-xs text-text-secondary mb-1">
            Order #{order.orderNumber} · {order.orderType}
          </p>
          <p className="text-xs text-text-disabled">
            {order.lineItems.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
          </p>
        </div>
      )}

      {!loading && !order && (
        <p className="text-xs text-text-disabled mt-1">Order details unavailable</p>
      )}

      <p className="text-xs text-text-disabled mt-2">
        {new Date(review.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}

export default ReviewCard;
