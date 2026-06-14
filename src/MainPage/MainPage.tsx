import { useDispatch, useSelector } from 'react-redux';
import Map from '../Map';
import OfferList from './OfferList';
import CitiesList from './CitiesList';
import { useCallback, useMemo, useState } from 'react';
import SortOptions, { SortType } from './SortOptions';
import { Offer } from '../types/offer';
import { setActiveCity } from '../store/action';
import { mockCityNames, getCityByName } from '../mocks/cities';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { AuthorizationStatus } from '../types/auth';
import {
  selectAuthorizationStatus,
  selectCity,
  selectCityOffers,
  selectIsOffersLoading,
  selectUserData,
} from '../store/selectors';

function getSortedOffers(offers: Offer[], sort: SortType): Offer[] {
  switch (sort) {
    case 'Price: low to high':
      return [...offers].sort((a, b) => a.price - b.price);
    case 'Price: high to low':
      return [...offers].sort((a, b) => b.price - a.price);
    case 'Top rated first':
      return [...offers].sort((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
}

export default function MainPage() {
  const activeCity = useSelector(selectCity);
  const isOffersLoading = useSelector(selectIsOffersLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userData = useSelector(selectUserData);

  const dispatch = useDispatch();

  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortType>('Popular');

  const cityOffers = useSelector(selectCityOffers);
  const sortedOffers = useMemo(
    () => getSortedOffers(cityOffers, activeSort),
    [cityOffers, activeSort],
  );
  const cityData = useMemo(() => getCityByName(activeCity), [activeCity]);

  const handleCityChange = useCallback(
    (city: string) => {
      dispatch(setActiveCity(city));
      setActiveSort('Popular');
    },
    [dispatch],
  );

  if (isOffersLoading) return <Spinner />;

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link
                className="header__logo-link header__logo-link--active"
                to="/"
              >
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

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList
              cities={mockCityNames}
              currentCity={activeCity}
              onCityChange={handleCityChange}
            />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {sortedOffers.length} places to stay in {activeCity}
              </b>
              <SortOptions value={activeSort} onChange={setActiveSort} />
              <OfferList
                offers={sortedOffers}
                activeOfferId={activeOfferId}
                onActiveChange={setActiveOfferId}
              />
            </section>
            <div className="cities__right-section">
              <Map
                city={cityData}
                offers={sortedOffers}
                activeOfferId={activeOfferId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
