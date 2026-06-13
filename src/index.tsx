import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const offersCount = 10;

root.render(
  <React.StrictMode>
    <App offersCount={offersCount} />
  </React.StrictMode>,
);
