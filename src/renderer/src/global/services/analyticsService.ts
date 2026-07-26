import {
  collection,
  query,
  where,
  getDocs,
  getAggregateFromServer,
  sum,
  count,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@renderer/firebase/config';
import { OrderDoc } from '@renderer/types/order';

//revenue section
export interface DateRange {
  start: number;
  end: number;
}

export interface AnalyticsSummary {
  revenue: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface TrendPoint {
  label: string;
  revenue: number;
  orderCount: number;
}

export interface RevenueBreakdown {
  label: string;
  revenue: number;
}

export interface OrderTypeAndPaymentBreakdown {
  byOrderType: RevenueBreakdown[];
  byPaymentType: RevenueBreakdown[];
}

//order section
export interface OrderTypeCounts {
  label: string;
  count: number;
}

export interface PeakHourPoint {
  hour: number;
  label: string;
  orderCount: number;
}

export interface OrdersBreakdown {
  byOrderType: OrderTypeCounts[];
  peakHours: PeakHourPoint[];
}

//menu section
export interface PopularItem {
  name: string;
  quantitySold: number;
}

export type BucketGranularity = 'hour' | 'day' | 'month';

export async function fetchAnalyticsSummary(range: DateRange): Promise<AnalyticsSummary> {
  const ordersQuery = query(
    collection(db, 'orders'),
    where('createdAt', '>=', Timestamp.fromMillis(range.start)),
    where('createdAt', '<', Timestamp.fromMillis(range.end)),
  );

  const result = await getAggregateFromServer(ordersQuery, {
    revenue: sum('bill.total'),
    orderCount: count(),
  });

  const revenuePaise = result.data().revenue;
  const orderCount = result.data().orderCount;
  const revenue = revenuePaise / 100; // paise -> rupees

  return {
    revenue,
    orderCount,
    avgOrderValue: orderCount > 0 ? Math.round(revenue / orderCount) : 0,
  };
}

export async function fetchOrdersInRange(range: DateRange): Promise<OrderDoc[]> {
  const ordersQuery = query(
    collection(db, 'orders'),
    where('createdAt', '>=', Timestamp.fromMillis(range.start)),
    where('createdAt', '<', Timestamp.fromMillis(range.end)),
  );

  const snapshot = await getDocs(ordersQuery);
  const orders: OrderDoc[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    orders.push({
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
    } as OrderDoc);
  });

  return orders;
}

function getBucketKey(date: Date, bucketBy: BucketGranularity): { key: number; label: string } {
  if (bucketBy === 'hour') {
    const bucketDate = new Date(date);
    bucketDate.setMinutes(0, 0, 0);
    return {
      key: bucketDate.getTime(),
      label: bucketDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  }
  if (bucketBy === 'day') {
    const bucketDate = new Date(date);
    bucketDate.setHours(0, 0, 0, 0);
    return {
      key: bucketDate.getTime(),
      label: bucketDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    };
  }
  const bucketDate = new Date(date.getFullYear(), date.getMonth(), 1);
  return {
    key: bucketDate.getTime(),
    label: bucketDate.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
  };
}

export async function fetchOrdersTrend(
  range: DateRange,
  bucketBy: BucketGranularity,
): Promise<TrendPoint[]> {
  const orders = await fetchOrdersInRange(range);
  const buckets = new Map<number, TrendPoint>();

  orders.forEach((order) => {
    if (order.orderStatus === 'cancelled') return;

    const date = new Date(order.createdAt);
    const { key, label } = getBucketKey(date, bucketBy);
    const existing = buckets.get(key) ?? { label, revenue: 0, orderCount: 0 };
    existing.revenue += (order.bill?.total ?? 0) / 100; // paise -> rupees
    existing.orderCount += 1;
    buckets.set(key, existing);
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b) // chronological order, not alphabetical label sort
    .map(([, point]) => point);
}

export async function fetchRevenueBreakdowns(
  range: DateRange,
): Promise<OrderTypeAndPaymentBreakdown> {
  const orders = await fetchOrdersInRange(range);

  const orderTypeMap = new Map<string, number>();
  const paymentTypeMap = new Map<string, number>();

  orders.forEach((order) => {
    if (order.orderStatus === 'cancelled') return;

    const orderType = order.orderType ?? 'unknown';
    const paymentType = order.razorpayOrderId ? 'Online' : 'COD';
    const revenue = (order.bill?.total ?? 0) / 100; // paise -> rupees

    orderTypeMap.set(orderType, (orderTypeMap.get(orderType) ?? 0) + revenue);
    paymentTypeMap.set(paymentType, (paymentTypeMap.get(paymentType) ?? 0) + revenue);
  });

  return {
    byOrderType: Array.from(orderTypeMap.entries()).map(([label, revenue]) => ({ label, revenue })),
    byPaymentType: Array.from(paymentTypeMap.entries()).map(([label, revenue]) => ({
      label,
      revenue,
    })),
  };
}

//orders section
export async function fetchOrdersBreakdown(range: DateRange): Promise<OrdersBreakdown> {
  const orders = await fetchOrdersInRange(range);

  const orderTypeMap = new Map<string, number>();
  const hourCounts = new Array(24).fill(0);

  orders.forEach((order) => {
    if (order.orderStatus === 'cancelled') return;

    const orderType = order.orderType ?? 'unknown';
    orderTypeMap.set(orderType, (orderTypeMap.get(orderType) ?? 0) + 1);

    const hour = new Date(order.createdAt).getHours();
    hourCounts[hour] += 1;
  });

  const byOrderType = Array.from(orderTypeMap.entries()).map(([label, count]) => ({
    label,
    count,
  }));

  const peakHours = hourCounts.map((orderCount, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    orderCount,
  }));

  return { byOrderType, peakHours };
}

//menu section
export async function fetchPopularItems(range: DateRange, limitCount = 5): Promise<PopularItem[]> {
  const orders = await fetchOrdersInRange(range);

  const itemMap = new Map<string, number>();

  orders.forEach((order) => {
    if (order.orderStatus === 'cancelled') return;

    order.lineItems?.forEach((item) => {
      itemMap.set(item.name, (itemMap.get(item.name) ?? 0) + item.quantity);
    });
  });

  return Array.from(itemMap.entries())
    .map(([name, quantitySold]) => ({ name, quantitySold }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, limitCount);
}
