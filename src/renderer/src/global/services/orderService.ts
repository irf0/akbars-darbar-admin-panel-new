import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  QueryDocumentSnapshot,
  DocumentData,
  where,
  Timestamp,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { db } from '@firebase-config/config';
import { OrderDoc, OrderStatus } from '@renderer/types/order';

export interface HistoryFilters {
  startDate?: number;
  endDate?: number;
  orderNumber?: string;
}

export interface HistoryPage {
  orders: OrderDoc[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const fetchOrderHistory = async (
  filters: HistoryFilters,
  cursor: QueryDocumentSnapshot<DocumentData> | null,
  pageSize = 20,
): Promise<HistoryPage> => {
  const constraints = [
    where('orderStatus', 'in', ['completed', 'cancelled']),
    orderBy('createdAt', 'desc'),
  ];

  if (filters.startDate) {
    constraints.push(where('createdAt', '>=', Timestamp.fromMillis(filters.startDate)));
  }
  if (filters.endDate) {
    constraints.push(where('createdAt', '<', Timestamp.fromMillis(filters.endDate)));
  }

  let historyQuery = query(collection(db, 'orders'), ...constraints, limit(pageSize));

  if (cursor) {
    historyQuery = query(
      collection(db, 'orders'),
      ...constraints,
      startAfter(cursor),
      limit(pageSize),
    );
  }

  const snapshot = await getDocs(historyQuery);
  const orders: OrderDoc[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    orders.push({
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
    } as OrderDoc);
  });

  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return {
    orders,
    lastDoc,
    hasMore: snapshot.docs.length === pageSize,
  };
};

export const fetchOrderById = async (orderId: string): Promise<OrderDoc | null> => {
  const snap = await getDoc(doc(db, 'orders', orderId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
  } as OrderDoc;
};

export const subscribeToOrders = (
  onData: (orders: OrderDoc[]) => void,
  onError: (error: Error) => void,
) => {
  const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    ordersQuery,
    (querySnapshot) => {
      const orders: OrderDoc[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
        } as OrderDoc);
      });
      onData(orders);
    },
    (error) => {
      onError(error);
    },
  );
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  return updateDoc(doc(db, 'orders', orderId), {
    orderStatus: status,
  });
};

export const rejectOrder = (orderId: string, reason: string) => {
  return updateDoc(doc(db, 'orders', orderId), {
    orderStatus: 'cancelled',
    cancellationReason: reason,
  });
};

export const assignRider = (orderId: string, riderName: string, mapsLink: string) => {
  return updateDoc(doc(db, 'orders', orderId), {
    riderName,
    riderMapsLink: mapsLink,
  });
};

function normalizeOrderNumber(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

export const searchOrderByNumber = async (searchTerm: string): Promise<OrderDoc[]> => {
  const normalizedSearch = normalizeOrderNumber(searchTerm);
  if (!normalizedSearch) return [];

  const exactQuery = query(
    collection(db, 'orders'),
    where('orderNumber', '==', searchTerm.trim().toUpperCase()),
    where('orderStatus', 'in', ['completed', 'cancelled']),
  );
  const exactSnapshot = await getDocs(exactQuery);
  if (!exactSnapshot.empty) {
    return exactSnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
      } as OrderDoc;
    });
  }

  const broadQuery = query(
    collection(db, 'orders'),
    where('orderStatus', 'in', ['completed', 'cancelled']),
    orderBy('createdAt', 'desc'),
    limit(500),
  );
  const snapshot = await getDocs(broadQuery);

  const matches: OrderDoc[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const candidateNumber = normalizeOrderNumber(String(data.orderNumber ?? ''));
    if (candidateNumber.includes(normalizedSearch)) {
      matches.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
      } as OrderDoc);
    }
  });

  return matches;
};
