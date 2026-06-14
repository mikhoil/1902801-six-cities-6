import { Review } from '../types/review';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

interface ReviewListProps {
  reviews: Review[];
  offerId: string;
  isAuthorized: boolean;
}

export default function ReviewList({
  reviews,
  isAuthorized,
  offerId,
}: ReviewListProps) {
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot;{' '}
        <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
      {isAuthorized && <ReviewForm offerId={offerId} />}
    </section>
  );
}
