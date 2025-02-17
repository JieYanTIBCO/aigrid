import { createRoot } from 'react-dom/client';
import GridLayout from './GridLayout';
import './index.css';

console.log('Mounting React app...');

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error('Root element not found');
    throw new Error('Root element not found');
}

console.log('Root element found:', rootElement);
const root = createRoot(rootElement);
console.log('Created React root');

root.render(<GridLayout />);

console.log('Rendered React app');

// Development mode HMR
if (process.env.NODE_ENV === 'development' && import.meta.hot) {
    import.meta.hot.accept();
}
