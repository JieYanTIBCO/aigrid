import { createRoot } from 'react-dom/client';
import './index.css';

const App = () => {
    return (
        <div>
            <h1>AIGrid - Live Reload</h1>
            <p>Development build with live reload enabled</p>
            <p>Try making changes to see instant updates!</p>
        </div>
    );
};

console.log('Mounting React app...');

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error('Root element not found');
    throw new Error('Root element not found');
}

console.log('Root element found:', rootElement);
const root = createRoot(rootElement);
console.log('Created React root');
root.render(<App />);
console.log('Rendered React app');
