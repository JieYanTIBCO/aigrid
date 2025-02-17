import React, { useState, useEffect } from 'react';
import GridWindow from './GridWindow';
import LayoutSelector, { LayoutType } from './LayoutSelector';
import { v4 as uuidv4 } from 'uuid';

interface WindowConfig {
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
}

interface LayoutConfig {
  type: LayoutType;
  windows: WindowConfig[];
}

const getDefaultWindowsForLayout = (type: LayoutType): WindowConfig[] => {
  switch (type) {
    case 'vertical-1-3':
      return [
        {
          id: uuidv4(),
          service: 'chatgpt',
          position: { x: 0, y: 0, width: window.innerWidth / 3, height: window.innerHeight - 20 },
          state: { isActive: true, isMinimized: false, zIndex: 1 },
        },
        {
          id: uuidv4(),
          service: 'claude',
          position: { x: window.innerWidth / 3, y: 0, width: window.innerWidth / 3, height: window.innerHeight - 20 },
          state: { isActive: false, isMinimized: false, zIndex: 0 },
        },
        {
          id: uuidv4(),
          service: 'custom',
          position: { x: (window.innerWidth * 2) / 3, y: 0, width: window.innerWidth / 3, height: window.innerHeight - 20 },
          state: { isActive: false, isMinimized: false, zIndex: 0 },
        },
      ];
    case 'vertical-1-2':
      return [
        {
          id: uuidv4(),
          service: 'chatgpt',
          position: { x: 0, y: 0, width: window.innerWidth / 2, height: window.innerHeight - 20 },
          state: { isActive: true, isMinimized: false, zIndex: 1 },
        },
        {
          id: uuidv4(),
          service: 'claude',
          position: { x: window.innerWidth / 2, y: 0, width: window.innerWidth / 2, height: window.innerHeight - 20 },
          state: { isActive: false, isMinimized: false, zIndex: 0 },
        },
      ];
    case 'grid-2x2':
      return [
        {
          id: uuidv4(),
          service: 'chatgpt',
          position: { x: 0, y: 0, width: window.innerWidth / 2, height: window.innerHeight / 2 },
          state: { isActive: true, isMinimized: false, zIndex: 1 },
        },
        {
          id: uuidv4(),
          service: 'claude',
          position: { x: window.innerWidth / 2, y: 0, width: window.innerWidth / 2, height: window.innerHeight / 2 },
          state: { isActive: false, isMinimized: false, zIndex: 0 },
        },
        {
          id: uuidv4(),
          service: 'custom',
          position: { x: 0, y: window.innerHeight / 2, width: window.innerWidth / 2, height: window.innerHeight / 2 },
          state: { isActive: false, isMinimized: false, zIndex: 0 },
        },
        {
          id: uuidv4(),
          service: 'custom',
          position: { x: window.innerWidth / 2, y: window.innerHeight / 2, width: window.innerWidth / 2, height: window.innerHeight / 2 },
          state: { isActive: false, isMinimized: false, zIndex: 0 },
        },
      ];
  }
};

const GridLayout: React.FC = () => {
  const [layout, setLayout] = useState<LayoutConfig>({
    type: 'vertical-1-3',
    windows: getDefaultWindowsForLayout('vertical-1-3'),
  });

  const handleLayoutChange = (type: LayoutType) => {
    setLayout({
      type,
      windows: getDefaultWindowsForLayout(type),
    });
    
    // Save layout preference
    chrome.storage.local.set({ preferredLayout: type });
  };

  useEffect(() => {
    // Load saved layout preference
    chrome.storage.local.get(['preferredLayout'], (result) => {
      if (result.preferredLayout) {
        handleLayoutChange(result.preferredLayout as LayoutType);
      }
    });
    
    // Handle window resize
    const handleResize = () => {
      setLayout(prev => ({
        ...prev,
        windows: getDefaultWindowsForLayout(prev.type),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWindowMove = (id: string, position: Pick<WindowConfig['position'], 'x' | 'y'>) => {
    setLayout(prev => ({
      ...prev,
      windows: prev.windows.map(window =>
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

  const handleWindowResize = (id: string, position: WindowConfig['position']) => {
    setLayout(prev => ({
      ...prev,
      windows: prev.windows.map(window =>
        window.id === id
          ? {
              ...window,
              position,
            }
          : window
      ),
    }));
  };

  const handleWindowStateChange = (id: string, state: Partial<WindowConfig['state']>) => {
    setLayout(prev => ({
      ...prev,
      windows: prev.windows.map(window =>
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
    <>
      <LayoutSelector currentLayout={layout.type} onLayoutChange={handleLayoutChange} />
      <div className={`grid-container layout-${layout.type}`}>
        {layout.windows.map(window => (
          <GridWindow
            key={window.id}
            config={window}
            onMove={handleWindowMove}
            onResize={handleWindowResize}
            onStateChange={handleWindowStateChange}
          />
        ))}
      </div>
    </>
  );
};

export default GridLayout;
