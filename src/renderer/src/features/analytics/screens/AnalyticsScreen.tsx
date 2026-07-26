import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchAnalyticsSummary,
  fetchOrdersTrend,
  fetchRevenueBreakdowns,
  AnalyticsSummary,
  TrendPoint,
  OrderTypeAndPaymentBreakdown,
  BucketGranularity,
  OrdersBreakdown,
  fetchOrdersBreakdown,
  PopularItem,
  fetchPopularItems,
} from '@renderer/global/services/analyticsService';
import {
  getTodayRange,
  getWeekRange,
  getMonthRange,
  getAllTimeRange,
} from '@renderer/global/utils/dateRanges';
import RangeToggle from '../components/RangeToggle';
import OverviewCards from '../components/OverviewCards';
import RevenueSection from '../components/RevenueSection';
import OrdersSection from '../components/OrdersSection';
import MenuPerformanceSection from '../components/MenuPerformanceSection';

type RangeOption = 'today' | 'week' | 'month' | 'all';

const bucketFor: Record<RangeOption, BucketGranularity> = {
  today: 'hour',
  week: 'day',
  month: 'day',
  all: 'month',
};

function AnalyticsScreen() {
  const [rangeOption, setRangeOption] = useState<RangeOption>('today');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [breakdowns, setBreakdowns] = useState<OrderTypeAndPaymentBreakdown | null>(null);
  const [ordersData, setOrdersData] = useState<OrdersBreakdown | null>(null);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary(): Promise<void> {
      setLoading(true);
      try {
        const range =
          rangeOption === 'today'
            ? getTodayRange()
            : rangeOption === 'week'
              ? getWeekRange()
              : rangeOption === 'month'
                ? getMonthRange()
                : getAllTimeRange();

        const [summaryData, trendData, breakdownData, ordersBreakdownData, popularItemsData] =
          await Promise.all([
            fetchAnalyticsSummary(range),
            fetchOrdersTrend(range, bucketFor[rangeOption]),
            fetchRevenueBreakdowns(range),
            fetchOrdersBreakdown(range),
            fetchPopularItems(range),
          ]);

        if (!cancelled) {
          setSummary(summaryData);
          setTrend(trendData);
          setBreakdowns(breakdownData);
          setOrdersData(ordersBreakdownData);
          setPopularItems(popularItemsData);
        }
      } catch (error) {
        console.log('Failed to load analytics', error);
        toast.error('Failed to load analytics');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [rangeOption]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h1 className="text-base font-medium">Analytics</h1>
        <RangeToggle value={rangeOption} onChange={setRangeOption} />
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading analytics...</p>
        ) : summary ? (
          <div className="flex flex-col gap-4 max-w-3xl">
            <OverviewCards summary={summary} />
            <RevenueSection trend={trend} breakdowns={breakdowns} />

            {/* Orders section */}
            <OrdersSection data={ordersData} />

            {/* Menu performance section */}
            <MenuPerformanceSection items={popularItems} />
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No data available</p>
        )}
      </div>
    </div>
  );
}

export default AnalyticsScreen;
