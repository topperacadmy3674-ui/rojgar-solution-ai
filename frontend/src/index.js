import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // यह लाइन जोड़ें

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* पूरे ऐप को BrowserRouter से घेर दें */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);