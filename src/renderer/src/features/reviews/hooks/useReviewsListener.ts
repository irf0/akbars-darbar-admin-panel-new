import { useEffect } from 'react';
import { subscribeToReviews } from '@renderer/global/services/reviewService';
import { useReviewsStore } from '../store/useReviewsStore';

export function useReviewsListener() {
  const setReviews = useReviewsStore((state) => state.setReviews);

  useEffect(() => {
    const unsubscribe = subscribeToReviews(
      (reviews) => setReviews(reviews),
      (error) => console.error('Failed to load reviews:', error),
    );

    return () => unsubscribe();
  }, [setReviews]);
}
