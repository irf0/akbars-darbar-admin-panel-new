import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchOrderHistory,
  searchOrderByNumber,
  HistoryFilters,
} from '@renderer/global/services/orderService';
import { useOrderHistoryStore } from '../store/useOrderHistoryStore';
import { OrderDoc } from '@renderer/types/order';
import OrderDetail from '@renderer/features/orders/components/OrderDetail';
import OrderHistoryCard from '../components/OrderHistoryCard';

function OrderHistoryScreen() {
  const {
    orders,
    lastDoc,
    hasMore,
    isLoading,
    isSearchMode,
    setPage,
    setLoading,
    setSearchResults,
    reset,
  } = useOrderHistoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDoc | null>(null);

  function buildFilters(): HistoryFilters {
    return {
      startDate: startDate ? new Date(startDate).setHours(0, 0, 0, 0) : undefined,
      endDate: endDate ? new Date(endDate).setHours(23, 59, 59, 999) : undefined,
    };
  }

  async function loadFirstPage(): Promise<void> {
    setLoading(true);
    try {
      const result = await fetchOrderHistory(buildFilters(), null);
      setPage(result.orders, result.lastDoc, result.hasMore, false);
    } catch (error) {
      console.log('Failed to load order history', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  }

  async function loadMore(): Promise<void> {
    setLoading(true);
    try {
      const result = await fetchOrderHistory(buildFilters(), lastDoc);
      setPage(result.orders, result.lastDoc, result.hasMore, true);
    } catch (error) {
      console.log('Failed to load more orders', error);
      toast.error('Failed to load more orders');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(): Promise<void> {
    if (!searchTerm.trim()) {
      reset();
      loadFirstPage();
      return;
    }

    setLoading(true);
    try {
      const results = await searchOrderByNumber(searchTerm);
      setSearchResults(results);
      if (results.length === 0) {
        toast.error(`No order found matching "${searchTerm}"`);
      }
    } catch (error) {
      console.log('Search failed', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reset();
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <h1 className="text-base font-medium mb-3">Order History</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-white"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium cursor-pointer">
            Search
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
        {orders.length === 0 && !isLoading ? (
          <p className="text-sm text-text-secondary">No orders found</p>
        ) : (
          orders.map((order) => (
            <OrderHistoryCard
              key={order.id}
              order={order}
              onClick={() => setSelectedOrder(order)}
            />
          ))
        )}

        {!isSearchMode && hasMore && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="self-center px-4 py-2 text-sm text-primary font-medium cursor-pointer disabled:opacity-50">
            {isLoading ? 'Loading...' : 'Load more'}
          </button>
        )}
      </div>

      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

export default OrderHistoryScreen;
