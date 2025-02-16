import React, { useState, useEffect, Component } from 'react';
import GridWindow from './GridWindow';
import { v4 as uuidv4 } from 'uuid';

interface LayoutConfig {
  type: 'grid' | 'horizontal' | 'vertical' | 'custom';
  dimensions: {
    columns: number;
    rows: number;
  };
  windows: Array<{
    id: string;
    service: 'chatgpt' | 'claude' | 'custom';
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    state: {
      isActive: boolean;
      isMinimized: boolean;
      zIndex: number;
    };
  }>;
}

const defaultLayout: LayoutConfig = {
  type: 'grid',
  dimensions: {
    columns: 2,
    rows: 2,
  },
  windows: [
    {
      id: uuidv4(),
      service: 'chatgpt',
      position: { x: 20, y: 20, width: 600, height: 400 },
      state: { isActive: true, isMinimized: false, zIndex: 1 },
    },
    {
      id: uuidv4(),
      service: 'claude',
      position: { x: 640, y: 20, width: 600, height: 400 },
      state: { isActive: false, isMinimized: false, zIndex: 0 },
    },
  ],
};

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GridLayout error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb' }}>
          <h2>Something went wrong</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const GridLayout: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutConfig>(defaultLayout);

  useEffect(() => {
    // Load saved layout from chrome.storage.local
    try {
      if (!chrome?.storage?.local) {
        throw new Error('Chrome storage is not available');
      }
      
      chrome.storage.local.get(['gridLayout'], (result) => {
        if (chrome.runtime.lastError) {
          setError(`Storage error: ${chrome.runtime.lastError.message}`);
          return;
        }
        if (result.gridLayout) {
          setLayout(result.gridLayout);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error('Failed to load layout:', err);
    }
  }, []);

  useEffect(() => {
    // Save layout to chrome.storage.local whenever it changes
    try {
      if (!chrome?.storage?.local) {
        throw new Error('Chrome storage is not available');
      }

      chrome.storage.local.set({ gridLayout: layout }, () => {
        if (chrome.runtime.lastError) {
          setError(`Storage error: ${chrome.runtime.lastError.message}`);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error('Failed to save layout:', err);
    }
  }, [layout]);

  const handleWindowMove = (id: string, position: Pick<LayoutConfig['windows'][0]['position'], 'x' | 'y'>) => {
    setLayout((prev) => ({
      ...prev,
      windows: prev.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              position: {
                ...window.position,
                ...position,
              },
            }
          : window
      ),
    }));
  };

  const handleWindowResize = (id: string, position: LayoutConfig['windows'][0]['position']) => {
    setLayout((prev) => ({
      ...prev,
      windows: prev.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              position,
            }
          : window
      ),
    }));
  };

  const handleWindowStateChange = (id: string, state: Partial<LayoutConfig['windows'][0]['state']>) => {
    setLayout((prev) => ({
      ...prev,
      windows: prev.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              state: {
                ...window.state,
                ...state,
              },
            }
          : state.zIndex
          ? {
              ...window,
              state: {
                ...window.state,
                isActive: false,
              },
            }
          : window
      ),
    }));
  };

  return (
    <ErrorBoundary>
      <div className="grid-container">
        {error ? (
          <div style={{ padding: '20px', color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb' }}>
            Error: {error}
          </div>
        ) : (
          layout.windows.map((window) => (
            <GridWindow
              key={window.id}
              config={window}
              onMove={handleWindowMove}
              onResize={handleWindowResize}
              onStateChange={handleWindowStateChange}
            />
          ))
        )}
      </div>
    </ErrorBoundary>
  );
};

export default GridLayout;
