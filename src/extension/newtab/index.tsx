import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import GridLayout from './GridLayout';
import './index.css';

const init = () => {
  try {
    const container = document.getElementById('root');
    if (!container) {
      throw new Error('Root element not found');
    }

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <GridLayout />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize newtab:', error);
  }
};

// Initialize after scripts are loaded
document.addEventListener('DOMContentLoaded', init);
