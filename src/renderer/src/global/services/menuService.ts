import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  DocumentReference,
  addDoc,
} from 'firebase/firestore';
import { db, storage } from '@renderer/firebase/config';
import { MenuItem } from '@renderer/types/menu';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const menuCollection = collection(db, 'menu');

const getMenuDocRef = async (itemId: string): Promise<DocumentReference> => {
  const q = query(menuCollection, where('id', '==', itemId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error(`Menu item "${itemId}" not found.`);
  }

  return snapshot.docs[0].ref;
};

export const subscribeToMenu = (
  onData: (items: MenuItem[]) => void,
  onError: (error: Error) => void,
) => {
  const menuQuery = query(menuCollection, orderBy('category'));

  return onSnapshot(
    menuQuery,
    (querySnapshot) => {
      const items: MenuItem[] = [];

      querySnapshot.forEach((docSnap) => {
        items.push(docSnap.data() as MenuItem);
      });

      onData(items);
    },
    (error) => {
      onError(error);
    },
  );
};

export const updateItemAvailability = async (itemId: string, available: boolean) => {
  const docRef = await getMenuDocRef(itemId);

  return updateDoc(docRef, {
    available,
  });
};

export const deleteMenuItem = async (itemId: string) => {
  const docRef = await getMenuDocRef(itemId);
  return deleteDoc(docRef);
};

export const updateMenuItem = async (itemId: string, data: Partial<MenuItem>) => {
  const docRef = await getMenuDocRef(itemId);

  return updateDoc(docRef, data);
};

export const uploadMenuImage = async (file: File): Promise<string> => {
  const imageRef = ref(storage, `menu-images/${Date.now()}-${file.name}`);

  await uploadBytes(imageRef, file);

  return getDownloadURL(imageRef);
};

export const createMenuItem = (data: Omit<MenuItem, 'id'>) => {
  return addDoc(collection(db, 'menu'), data);
};
