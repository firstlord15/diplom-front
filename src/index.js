import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './app/App';
import './normalize.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();