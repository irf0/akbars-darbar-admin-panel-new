import { Review } from '@renderer/types/reviews';
import { create } from 'zustand';

interface ReviewsStore {
  reviews: Review[];
  isLoading: boolean;
  setReviews: (reviews: Review[]) => void;
}

export const useReviewsStore = create<ReviewsStore>((set) => ({
  reviews: [],
  isLoading: true,
  setReviews: (reviews) => set({ reviews, isLoading: false }),
}));
