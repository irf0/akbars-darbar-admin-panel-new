import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@firebase-config/config';
import { OrderDoc, OrderStatus } from '@renderer/types/order';

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
