import { ChangeEvent, FormEvent, Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitReview } from '../store/apiActions';
import { AppDispatch } from '../store';

const RATING_OPTIONS = [
  { value: '5', labelId: '5-stars', title: 'perfect' },
  { value: '4', labelId: '4-stars', title: 'good' },
  { value: '3', labelId: '3-stars', title: 'not bad' },
  { value: '2', labelId: '2-stars', title: 'badly' },
  { value: '1', labelId: '1-star', title: 'terribly' },
];

const MIN_REVIEW_LENGTH = 50;
const MAX_REVIEW_LENGTH = 300;

type ReviewFormProps = {
  offerId: string;
};

type FormState = {
  rating: string;
  review: string;
};

function ReviewForm({ offerId }: ReviewFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormState>({
    rating: '',
    review: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    formData.rating !== '' &&
    formData.review.length >= MIN_REVIEW_LENGTH &&
    formData.review.length <= MAX_REVIEW_LENGTH;

  function handleRatingChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, rating: e.target.value });
  }

  function handleReviewChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFormData({ ...formData, review: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    dispatch(
      submitReview({
        offerId,
        comment: formData.review,
        rating: Number(formData.rating),
      }),
    )
      .unwrap()
      .then(() => {
        setFormData({ rating: '', review: '' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <form
      className="reviews__form form"
      action="#"
      method="post"
      onSubmit={handleSubmit}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {RATING_OPTIONS.map(({ value, labelId, title }) => (
          <Fragment key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={labelId}
              type="radio"
              checked={formData.rating === value}
              onChange={handleRatingChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor={labelId}
              className="reviews__rating-label form__rating-label"
              title={title}
            >
              <svg className="form__star-image" width="37" height="33">
                <use href="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.review}
        onChange={handleReviewChange}
        disabled={isSubmitting}
        minLength={MIN_REVIEW_LENGTH}
        maxLength={MAX_REVIEW_LENGTH}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
