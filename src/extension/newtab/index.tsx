import { createRoot } from 'react-dom/client';
import { Component, useEffect } from 'react';
import './index.css';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<{children: React.ReactNode}, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };
    
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{padding: '20px', color: 'red'}}>
                    <h1>Something went wrong</h1>
                    <pre>{this.state.error?.message}</pre>
                    <pre>{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const App = () => {
    useEffect(() => {
        console.log('React component mounted successfully');
        return () => console.log('React component unmounting');
    }, []);

    return (
        <div>
            <h1>AIGrid - Live Reload</h1>
            <p>Development build with live reload enabled</p>
            <p>Try making changes to see instant updates!</p>
        </div>
    );
};

try {
    console.group('React Initialization');
    console.log('Mounting React app...');

    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error('Root element not found - check HTML structure');
    }

    console.log('Root element found:', rootElement);
    const root = createRoot(rootElement);
    console.log('Created React root successfully');
    
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
    
    console.log('Rendered React app successfully');
    console.groupEnd();
} catch (error) {
    console.error('Failed to initialize React:', error);
    // Show error in debug panel
    const debug = document.getElementById('debug');
    if (debug) {
        debug.style.display = 'block';
        if (error instanceof Error) {
            debug.textContent = `React Initialization Error:\n${error.message}\n\nStack:\n${error.stack}`;
        } else {
            debug.textContent = `React Initialization Error:\n${String(error)}`;
        }
    }
}
