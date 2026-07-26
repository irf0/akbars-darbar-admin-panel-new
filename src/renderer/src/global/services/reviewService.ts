import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@renderer/firebase/config';
import { Review } from '@renderer/types/reviews';

export const subscribeToReviews = (
  onData: (reviews: Review[]) => void,
  onError: (error: Error) => void,
) => {
  const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    reviewsQuery,
    (querySnapshot) => {
      const reviews: Review[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        reviews.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toMillis() : Date.now(),
        } as Review);
      });
      onData(reviews);
    },
    (error) => {
      onError(error);
    },
  );
};

export const deleteReview = (reviewId: string) => {
  return deleteDoc(doc(db, 'reviews', reviewId));
};
