import MainPage from './MainPage/MainPage';

interface AppProps {
  offersCount: number;
}

export default function App({ offersCount }: AppProps) {
  return <MainPage offersCount={offersCount} />;
}
