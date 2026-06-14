import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewList from './ReviewList';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { makeMockReview } from '../utils/mock';

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      [NameSpace.App]: {
        city: 'Paris',
        isOffersLoading: false,
        isOfferLoading: false,
      },
      [NameSpace.Data]: {
        offers: [],
        favoriteOffers: [],
        currentOffer: null,
        nearbyOffers: [],
        reviews: [],
      },
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: null,
      },
    },
  });

const renderReviewList = (
  isAuthorized: boolean,
  reviews = [makeMockReview()],
) =>
  render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <ReviewList
          reviews={reviews}
          offerId="offer-1"
          isAuthorized={isAuthorized}
        />
      </MemoryRouter>
    </Provider>,
  );

describe('ReviewList', () => {
  it('should render reviews count', () => {
    const reviews = [makeMockReview(), makeMockReview()];
    renderReviewList(true, reviews);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render all review comments', () => {
    const reviews = [makeMockReview(), makeMockReview()];
    renderReviewList(false, reviews);
    reviews.forEach((review) => {
      expect(screen.getByText(review.comment)).toBeInTheDocument();
    });
  });

  it('should show ReviewForm when isAuthorized is true', () => {
    renderReviewList(true);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should not show ReviewForm when isAuthorized is false', () => {
    renderReviewList(false);
    expect(
      screen.queryByRole('button', { name: /submit/i }),
    ).not.toBeInTheDocument();
  });

  it('should render "Reviews" heading', () => {
    renderReviewList(false, []);
    expect(screen.getByText(/Reviews/)).toBeInTheDocument();
  });
});
