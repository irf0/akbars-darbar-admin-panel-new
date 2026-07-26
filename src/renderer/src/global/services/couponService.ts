import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@renderer/firebase/config';
import { Coupon } from '@renderer/types/coupon';

export const subscribeToCoupons = (
  onData: (coupons: Coupon[]) => void,
  onError: (error: Error) => void,
) => {
  const couponsQuery = query(collection(db, 'coupons'), orderBy('code'));

  return onSnapshot(
    couponsQuery,
    (querySnapshot) => {
      const coupons: Coupon[] = [];
      querySnapshot.forEach((docSnap) => {
        coupons.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as Coupon);
      });
      onData(coupons);
    },
    (error) => {
      onError(error);
    },
  );
};

export const updateCouponActive = (couponId: string, active: boolean) => {
  return updateDoc(doc(db, 'coupons', couponId), { active });
};

export const updateCoupon = (couponId: string, data: Partial<Coupon>) => {
  return updateDoc(doc(db, 'coupons', couponId), data);
};

export const createCoupon = (data: Omit<Coupon, 'id'>) => {
  return addDoc(collection(db, 'coupons'), data);
};

export const deleteCoupon = (couponId: string) => {
  return deleteDoc(doc(db, 'coupons', couponId));
};
