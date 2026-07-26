import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@renderer/firebase/config';
import { AdminSettings } from '@renderer/types/admin';

export const subscribeToAdminSettings = (
  onData: (settings: AdminSettings) => void,
  onError: (error: Error) => void,
) => {
  return onSnapshot(
    doc(db, 'adminSettings', 'shopConfigs'),
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as AdminSettings);
      }
    },
    (error) => {
      onError(error);
    },
  );
};

export const updateAdminSettings = (data: Partial<AdminSettings>) => {
  return updateDoc(doc(db, 'adminSettings', 'shopConfigs'), data);
};
