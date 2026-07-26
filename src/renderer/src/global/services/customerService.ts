import { doc, getDoc } from 'firebase/firestore';
import { db } from '@renderer/firebase/config';
import { Customer, Address } from '@renderer/types/order';

export const fetchCustomer = async (uid: string): Promise<Customer | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  console.log('fetchCustomer uid:', uid, 'exists:', snap.exists(), 'data:', snap.data());

  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    name: data.firstName,
    phone: data.phone,
  };
};

export const fetchAddress = async (uid: string, addressId: string): Promise<Address | null> => {
  const snap = await getDoc(doc(db, 'users', uid, 'addresses', addressId));
  if (!snap.exists()) return null;
  return snap.data() as Address;
};
