import Map from '../Map';
import ReviewList from './ReviewList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import NearOffersList from './NearOffersList';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  fetchNearbyOffers,
  fetchOffer,
  fetchReviews,
} from '../store/apiActions';
import Spinner from '../Spinner/Spinner';
import { AuthorizationStatus } from '../types/auth';
import {
  selectAuthorizationStatus,
  selectCurrentOffer,
  selectIsOfferLoading,
  selectNearbyOffers,
  selectReviews,
  selectUserData,
} from '../store/selectors';

const OFFER_TYPE_MAP: Record<string, string> = {
  apartment: 'Apartment',
  room: 'Private Room',
  house: 'House',
  hotel: 'Hotel',
};

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const currentOffer = useSelector(selectCurrentOffer);
  const nearbyOffers = useSelector(selectNearbyOffers);
  const reviews = useSelector(selectReviews);
  const isOfferLoading = useSelector(selectIsOfferLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userData = useSelector(selectUserData);

  useEffect(() => {
    if (id) {
      dispatch(fetchOffer(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchReviews(id));
    }
  }, [id, dispatch]);

  if (isOfferLoading) return <Spinner />;

  if (!currentOffer) return <Navigate to="/not-found" />;

  const {
    bedrooms,
    city,
    description,
    goods,
    host,
    images,
    isFavorite,
    isPremium,
    rating,
    title,
    type,
    maxAdults,
    price,
  } = currentOffer;

  const ratingPercent = `${(Math.round(rating) / 5) * 100}%`;
  const offerType = OFFER_TYPE_MAP[type] ?? type;
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === AuthorizationStatus.Auth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to="/favorites"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__user-name user__name">
                          {userData?.email}
                        </span>
                        <span className="header__favorite-count">3</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <a className="header__nav-link" href="#todo">
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to="/login"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.slice(0, 6).map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image}
                    alt="Photo studio"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{title}</h1>
                <button
                  className={`offer__bookmark-button button${isFavorite ? ' offer__bookmark-button--active' : ''}`}
                  type="button"
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingPercent }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {rating}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offerType}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper${host.isPro ? ' offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{host.name}</span>
                  {host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{description}</p>
                </div>
              </div>
              <ReviewList
                reviews={reviews}
                offerId={id!}
                isAuthorized={isAuthorized}
              />
            </div>
          </div>
          <Map city={city} offers={nearbyOffers} activeOfferId={id} />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <NearOffersList offers={nearbyOffers} />
          </section>
        </div>
      </main>
    </div>
  );
}
