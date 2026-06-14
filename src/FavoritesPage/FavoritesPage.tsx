import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OfferCard from '../MainPage/OfferCard';
import { selectFavoriteOffers } from '../store/selectors';
import { useEffect, useMemo } from 'react';
import { fetchFavorites } from '../store/apiActions';
import { AppDispatch } from '../store';
import Header from '../Header';

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteOffers = useSelector(selectFavoriteOffers);
  const cities = useMemo(
    () => [...new Set(favoriteOffers.map((offer) => offer.city.name))],
    [favoriteOffers],
  );

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {cities.map((city) => (
                <li key={city} className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <Link className="locations__item-link" to="/">
                        <span>{city}</span>
                      </Link>
                    </div>
                  </div>
                  <div className="favorites__places">
                    {favoriteOffers
                      .filter((offer) => offer.city.name === city)
                      .map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          classNamePrefix="favorites"
                        />
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}
