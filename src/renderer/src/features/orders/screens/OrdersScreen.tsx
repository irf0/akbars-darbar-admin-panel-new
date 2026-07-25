import { useOrdersStore } from '../store/useOrdersStore';
import { rejectOrder, updateOrderStatus } from '@renderer/global/services/orderService';
import OrderTabs from '../components/OrderTabs';
import OrderCard from '../components/OrderCard';
import OrderDetail from '../components/OrderDetail';
import { OrderDoc, OrderStatus } from '@renderer/types/order';
import { printKOT } from '@renderer/global/services/printService';
import { useState } from 'react';
import RejectOrderModal from '../components/RejectOrderModal';
import { toast } from 'sonner';

const nextStatus: Record<OrderStatus, OrderStatus> = {
  placed: 'preparing',
  preparing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'completed',
  completed: 'completed',
  cancelled: 'cancelled',
};

function OrdersScreen() {
  const orders = useOrdersStore((state) => state.orders);
  const activeTab = useOrdersStore((state) => state.activeTab);
  const setActiveTab = useOrdersStore((state) => state.setActiveTab);
  const selectedOrderId = useOrdersStore((state) => state.selectedOrderId);
  const selectOrder = useOrdersStore((state) => state.selectOrder);
  const [rejectingOrder, setRejectingOrder] = useState<OrderDoc | null>(null);

  const counts = orders.reduce(
    (acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  const visibleOrders = orders.filter((order) => order.orderStatus === activeTab);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  async function handleAction(order: OrderDoc): Promise<void> {
    const isAccepting = order.orderStatus === 'placed';
    await updateOrderStatus(order.id, nextStatus[order.orderStatus]);
    if (isAccepting) {
      printKOT(order);
    }
  }

  async function handleConfirmReject(reason: string): Promise<void> {
    if (!rejectingOrder) return;
    try {
      await rejectOrder(rejectingOrder.id, reason);
      toast.success('Order rejected');
      setRejectingOrder(null);
    } catch (error) {
      console.log('Failed to reject order', error);
      toast.error('Failed to reject order');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100">
        <h1 className="text-base font-medium">Orders</h1>
      </div>

      <OrderTabs active={activeTab} counts={counts} onChange={setActiveTab} />

      {rejectingOrder && (
        <RejectOrderModal
          orderNumber={rejectingOrder.orderNumber}
          onCancel={() => setRejectingOrder(null)}
          onConfirm={handleConfirmReject}
        />
      )}

      <div className="flex flex-col gap-3 p-5 overflow-y-auto">
        {visibleOrders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders in this stage</p>
        ) : (
          visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => selectOrder(order.id)}
              onAction={() => handleAction(order)}
              onReject={() => setRejectingOrder(order)}
            />
          ))
        )}
      </div>

      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => selectOrder(null)} />}
    </div>
  );
}

export default OrdersScreen;
