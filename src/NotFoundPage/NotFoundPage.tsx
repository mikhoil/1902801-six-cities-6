import { Link } from 'react-router-dom';
import Header from '../Header';

export default function NotFoundPage() {
  return (
    <div className="page page--gray page--not-found">
      <Header />
      <main className="page__main page__main--not-found">
        <div className="page__not-found-container container">
          <section className="not-found">
            <h1 className="not-found__title">404 Not Found</h1>
            <Link to="/">Return to main page</Link>
          </section>
        </div>
      </main>
    </div>
  );
}
