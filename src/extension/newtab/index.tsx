import React from 'react';
import { createRoot } from 'react-dom/client';
import MainLayout from './layouts/MainLayout';
import './index.css';
import './components/components.css';

console.log('Mounting React app...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Root element found:', rootElement);
const root = createRoot(rootElement);
console.log('Created React root');

root.render(
  <React.StrictMode>
    <MainLayout />
  </React.StrictMode>
);

console.log('Rendered React app');

// Development mode HMR
if (process.env.NODE_ENV === 'development' && import.meta.hot) {
  import.meta.hot.accept();
}
