import { useReviewsListener } from '../hooks/useReviewsListener';
import { useReviewsStore } from '../store/useReviewsStore';
import ReviewCard from '../components/ReviewCard';

function ReviewsScreen() {
  useReviewsListener();

  const reviews = useReviewsStore((state) => state.reviews);
  const isLoading = useReviewsStore((state) => state.isLoading);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <h1 className="text-base font-medium">Reviews</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 max-w-2xl">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-text-secondary">No reviews yet</p>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}

export default ReviewsScreen;
