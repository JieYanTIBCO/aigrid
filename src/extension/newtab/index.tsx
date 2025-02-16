import React from 'react';
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

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
