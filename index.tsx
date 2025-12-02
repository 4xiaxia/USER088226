
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/styles/cards.css'; // Import custom effects
import './src/styles/slider.css'; // Import slider effects

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
