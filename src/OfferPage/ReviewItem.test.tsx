import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewItem from './ReviewItem';
import { makeMockReview } from '../utils/mock';

describe('ReviewItem', () => {
  it('should render user name', () => {
    const review = makeMockReview();
    render(<ReviewItem review={review} />);
    expect(screen.getByText(review.user.name)).toBeInTheDocument();
  });

  it('should render review comment', () => {
    const review = makeMockReview();
    render(<ReviewItem review={review} />);
    expect(screen.getByText(review.comment)).toBeInTheDocument();
  });

  it('should render user avatar with correct src', () => {
    const review = makeMockReview();
    render(<ReviewItem review={review} />);
    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toHaveAttribute('src', review.user.avatarUrl);
  });

  it('should render time element with correct dateTime attribute', () => {
    const review = { ...makeMockReview(), date: '2024-06-15T10:00:00.000Z' };
    const { container } = render(<ReviewItem review={review} />);
    expect(container.querySelector('time')).toHaveAttribute(
      'dateTime',
      '2024-06-15',
    );
  });
});
