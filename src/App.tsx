import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage/MainPage';
import OfferPage from './OfferPage/OfferPage';
import LoginPage from './LoginPage/LoginPage';
import FavoritesPage from './FavoritesPage/FavoritesPage';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import { Offer } from './mocks/offers';

interface AppProps {
  offers: Offer[];
}

export default function App({ offers }: AppProps) {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage offers={offers} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage offers={offers} />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
