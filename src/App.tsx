import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage/MainPage';
import OfferPage from './OfferPage/OfferPage';
import LoginPage from './LoginPage/LoginPage';
import FavoritesPage from './FavoritesPage/FavoritesPage';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import PrivateRoute from './PrivateRoute/PrivateRoute';

interface AppProps {
  offersCount: number;
}

export default function App({ offersCount }: AppProps) {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage offersCount={offersCount} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
