import React, { useState, useEffect } from 'react';
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

const GridLayout: React.FC = () => {
  const [layout, setLayout] = useState<LayoutConfig>(defaultLayout);

  useEffect(() => {
    // Load saved layout from chrome.storage.local
    chrome.storage.local.get(['gridLayout'], (result) => {
      if (result.gridLayout) {
        setLayout(result.gridLayout);
      }
    });
  }, []);

  useEffect(() => {
    // Save layout to chrome.storage.local whenever it changes
    chrome.storage.local.set({ gridLayout: layout });
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
    <div className="grid-container">
      {layout.windows.map((window) => (
        <GridWindow
          key={window.id}
          config={window}
          onMove={handleWindowMove}
          onResize={handleWindowResize}
          onStateChange={handleWindowStateChange}
        />
      ))}
    </div>
  );
};

export default GridLayout;
