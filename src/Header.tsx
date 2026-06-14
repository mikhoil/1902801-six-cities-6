import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/apiActions';
import {
  selectAuthorizationStatus,
  selectUserData,
  selectFavoriteOffers,
} from './store/selectors';
import { AuthorizationStatus } from './types/auth';
import { AppDispatch } from './store';

type HeaderProps = {
  isActiveMain?: boolean;
};

function Header({ isActiveMain }: HeaderProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userData = useSelector(selectUserData);
  const favoriteOffers = useSelector(selectFavoriteOffers);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className={`header__logo-link${isActiveMain ? ' header__logo-link--active' : ''}`}
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
                      <div className="header__avatar-wrapper user__avatar-wrapper" />
                      <span className="header__user-name user__name">
                        {userData?.email}
                      </span>
                      <span className="header__favorite-count">
                        {favoriteOffers.length}
                      </span>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <button
                      className="header__nav-link"
                      type="button"
                      onClick={handleLogout}
                    >
                      <span className="header__signout">Sign out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to="/login"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper" />
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
