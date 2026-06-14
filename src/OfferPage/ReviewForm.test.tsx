import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import ReviewForm from './ReviewForm';
import { rootReducer } from '../store/rootReducer';
import { AuthorizationStatus } from '../types/auth';
import { NameSpace } from '../types/namespace';
import { createAPI } from '../utils/api';
import { makeMockReview } from '../utils/mock';

const api = createAPI();
const mockAPI = new MockAdapter(api);

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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: api } }),
  });

const renderReviewForm = () =>
  render(
    <Provider store={makeStore()}>
      <ReviewForm offerId="offer-1" />
    </Provider>,
  );

const VALID_REVIEW = 'A'.repeat(50);

describe('ReviewForm', () => {
  beforeEach(() => {
    mockAPI.reset();
  });

  it('should render textarea', () => {
    renderReviewForm();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render 5 rating inputs', () => {
    const { container } = renderReviewForm();
    expect(container.querySelectorAll('input[name="rating"]')).toHaveLength(5);
  });

  it('should have disabled submit button when form is empty', () => {
    renderReviewForm();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should have disabled submit button when only rating is set', () => {
    renderReviewForm();
    fireEvent.click(screen.getByTitle('good'));
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should have disabled submit button when only review text is set', () => {
    renderReviewForm();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: VALID_REVIEW },
    });
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should have disabled submit button when review text is too short', () => {
    renderReviewForm();
    fireEvent.click(screen.getByTitle('good'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Too short' },
    });
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should enable submit button with valid rating and review', () => {
    renderReviewForm();
    fireEvent.click(screen.getByTitle('good'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: VALID_REVIEW },
    });
    expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
  });

  it('should submit review and reset form on success', async () => {
    const reviews = [makeMockReview()];
    mockAPI.onPost('/comments/offer-1').reply(200, reviews);
    const store = makeStore();

    render(
      <Provider store={store}>
        <ReviewForm offerId="offer-1" />
      </Provider>,
    );

    fireEvent.click(screen.getByTitle('good'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: VALID_REVIEW },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await vi.waitFor(() => {
      expect(store.getState()[NameSpace.Data].reviews).toEqual(reviews);
    });
  });
});
