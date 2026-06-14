import { useSelector } from 'react-redux';
import Map from '../Map';
import { RootState } from '../store';
import OfferList from './OfferList';
import CitiesList from './CitiesList';
import { useMemo, useState } from 'react';
import SortOptions, { SortType } from './SortOptions';

export default function MainPage() {
  const activeCity = useSelector((state: RootState) => state.app.activeCity);

  const allOffers = useSelector((state: RootState) => state.app.offers);

  const [sortType, setSortType] = useState<SortType>('Popular');

  const [activeId, setActiveId] = useState<string | null>(null);

  const offersByCity = useMemo(() => {
    const filtered = allOffers.filter((p: any) => p.city?.name === activeCity);
    if (sortType === 'Popular') {
      return filtered;
    }
    if (sortType === 'Price: low to high') {
      return [...filtered].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (sortType === 'Price: high to low') {
      return [...filtered].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [allOffers, activeCity, sortType]);

  const offersCount = offersByCity.length;

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a
                    className="header__nav-link header__nav-link--profile"
                    href="#"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">
                      Oliver.conner@gmail.com
                    </span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList currentCity={activeCity} />
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {offersCount} places to stay in {activeCity}
              </b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
              <SortOptions value={sortType} onChange={setSortType} />
              <OfferList offers={offersByCity} onActiveChange={setActiveId} />
            </section>
            <div className="cities__right-section">
              <Map
                offers={offersByCity}
                activeOfferId={activeId}
                containerClassName="cities__map map"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
