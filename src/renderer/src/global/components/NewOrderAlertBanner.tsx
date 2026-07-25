import { useNavigate } from 'react-router-dom';
import { useNewOrderAlert } from '../hooks/useNewOrderAlert';
import { useOrderAlertStore } from '../store/useOrderAlertStore';

function NewOrderAlertBanner() {
  const { unacknowledgedOrders } = useNewOrderAlert();
  const markSeen = useOrderAlertStore((state) => state.markSeen);
  const navigate = useNavigate();

  if (unacknowledgedOrders.length === 0) return null;

  function handleView(): void {
    markSeen(unacknowledgedOrders.map((order) => order.id));
    navigate('/orders');
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-error text-white px-5 py-3 flex items-center justify-between">
      <p className="text-sm font-medium">
        {unacknowledgedOrders.length} new order{unacknowledgedOrders.length > 1 ? 's' : ''} waiting
      </p>
      <button
        onClick={handleView}
        className="bg-white text-error px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer">
        View
      </button>
    </div>
  );
}

export default NewOrderAlertBanner;
