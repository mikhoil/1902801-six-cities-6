import { useDispatch, useSelector } from 'react-redux';
import Map from '../Map';
import OfferList from './OfferList';
import CitiesList from './CitiesList';
import { useCallback, useMemo, useState } from 'react';
import SortOptions, { SortType } from './SortOptions';
import { Offer } from '../types/offer';
import { setActiveCity } from '../store/action';
import { mockCityNames, getCityByName } from '../mocks/cities';
import Spinner from '../Spinner/Spinner';
import {
  selectCity,
  selectCityOffers,
  selectIsOffersLoading,
} from '../store/selectors';
import Header from '../Header';

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
      <Header />

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
