import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/cards.css';
import './styles/demos.css';
import './styles/experience.css';
import './styles/contact.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
