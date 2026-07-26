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
import { Rider } from '@renderer/types/rider';

export const subscribeToRiders = (
  onData: (riders: Rider[]) => void,
  onError: (error: Error) => void,
) => {
  const ridersQuery = query(collection(db, 'riders'), orderBy('name'));

  return onSnapshot(
    ridersQuery,
    (querySnapshot) => {
      const riders: Rider[] = [];
      querySnapshot.forEach((docSnap) => {
        riders.push({ id: docSnap.id, ...docSnap.data() } as Rider);
      });
      onData(riders);
    },
    (error) => {
      onError(error);
    },
  );
};

export const createRider = (data: Omit<Rider, 'id'>) => {
  return addDoc(collection(db, 'riders'), data);
};

export const updateRider = (riderId: string, data: Partial<Rider>) => {
  return updateDoc(doc(db, 'riders', riderId), data);
};

export const deleteRider = (riderId: string) => {
  return deleteDoc(doc(db, 'riders', riderId));
};
