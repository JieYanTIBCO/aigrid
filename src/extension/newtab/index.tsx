import GridLayout from './GridLayout';
import './index.css';

const init = () => {
  try {
    const container = document.getElementById('root');
    if (!container) {
      throw new Error('Root element not found');
    }

    // Access React and ReactDOM from window since they're loaded via script tags
    const root = (window as any).ReactDOM.createRoot(container);
    root.render(
      (window as any).React.createElement(
        (window as any).React.StrictMode,
        null,
        (window as any).React.createElement(GridLayout)
      )
    );
  } catch (error) {
    console.error('Failed to initialize newtab:', error);
  }
};

// Initialize after scripts are loaded
document.addEventListener('DOMContentLoaded', init);
