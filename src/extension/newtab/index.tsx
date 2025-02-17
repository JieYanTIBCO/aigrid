import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App: React.FC = () => {
    return (
        <div>
            <h1>AIGrid - Live Reload</h1>
            <p>Development build with live reload enabled</p>
            <p>Try making changes to see instant updates!</p>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(<App />);

// For debug
console.log('React version:', React.version);
