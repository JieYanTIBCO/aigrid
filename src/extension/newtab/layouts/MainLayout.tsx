import React, { useState, useEffect } from 'react';
import SidePanel from '../components/SidePanel';
import UnifiedInput from '../components/UnifiedInput';
import LayoutControl from '../components/LayoutControl';
import GridWindow from '../GridWindow';
import { LayoutType } from '../LayoutSelector';
import './MainLayout.css';

interface ModelConfig {
  id: string;
  name: string;
  icon: string;
  service: 'chatgpt' | 'claude' | 'custom';
}

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

const defaultModels: ModelConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '/icons/OpenAI_Logo.svg',
    service: 'chatgpt'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '/icons/Claude_AI_logo.svg',
    service: 'claude'
  }
];

const MainLayout: React.FC = () => {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>('vertical-1-3');
  const [activeModel, setActiveModel] = useState(defaultModels[0].id);
  const [sidePanelWidth, setSidePanelWidth] = useState(250);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [windows, setWindows] = useState<WindowConfig[]>(() => 
    defaultModels.map((model, index) => ({
      id: model.id,
      service: model.service,
      position: {
        x: index * (typeof window !== 'undefined' ? window.innerWidth / 3 : 0),
        y: 0,
        width: typeof window !== 'undefined' ? window.innerWidth / 3 : 0,
        height: typeof window !== 'undefined' ? window.innerHeight - 100 : 0
      },
      state: {
        isActive: model.id === defaultModels[0].id,
        isMinimized: false,
        zIndex: index
      }
    }))
  );

  useEffect(() => {
    const updateWindowSizes = () => {
      const viewWidth = window.innerWidth - (isPanelCollapsed ? 40 : sidePanelWidth);
      const viewHeight = window.innerHeight;

      setWindows(prev => {
        switch (currentLayout) {
          case 'vertical-1-3':
            return prev.map((window, index) => ({
              ...window,
              position: {
                ...window.position,
                x: (isPanelCollapsed ? 40 : sidePanelWidth) + index * (viewWidth / 3),
                width: viewWidth / 3,
                height: viewHeight - 100
              }
            }));
          case 'vertical-1-2':
            return prev.slice(0, 2).map((window, index) => ({
              ...window,
              position: {
                ...window.position,
                x: (isPanelCollapsed ? 40 : sidePanelWidth) + index * (viewWidth / 2),
                width: viewWidth / 2,
                height: viewHeight - 100
              }
            }));
          case 'grid-2x2':
            return prev.map((window, index) => ({
              ...window,
              position: {
                ...window.position,
                x: (isPanelCollapsed ? 40 : sidePanelWidth) + (index % 2) * (viewWidth / 2),
                y: Math.floor(index / 2) * ((viewHeight - 100) / 2),
                width: viewWidth / 2,
                height: (viewHeight - 100) / 2
              }
            }));
          default:
            return prev;
        }
      });
    };

    if (typeof window !== 'undefined') {
      updateWindowSizes();
      window.addEventListener('resize', updateWindowSizes);
      return () => window.removeEventListener('resize', updateWindowSizes);
    }
  }, [currentLayout, isPanelCollapsed, sidePanelWidth]);

  const handleSubmit = (text: string, target: string) => {
    console.log(`Sending message to ${target}:`, text);
    // TODO: Implement actual message handling
  };

  const handleFullscreen = (modelId: string) => {
    setWindows(prev => prev.map(window => ({
      ...window,
      state: {
        ...window.state,
        isActive: window.id === modelId,
        zIndex: window.id === modelId ? Date.now() : window.state.zIndex
      }
    })));
  };

  const handlePanelResize = (width: number) => {
    setSidePanelWidth(width);
    document.documentElement.style.setProperty('--side-panel-width', `${width}px`);
  };

  const handlePanelCollapse = (collapsed: boolean) => {
    setIsPanelCollapsed(collapsed);
    document.documentElement.style.setProperty('--side-panel-width', collapsed ? '40px' : `${sidePanelWidth}px`);
  };

  return (
    <div 
      className="main-layout"
      data-panel-collapsed={isPanelCollapsed}
    >
      <SidePanel
        models={defaultModels}
        shortcuts={[
          { id: '1', name: 'Toggle Layout', action: () => null },
          { id: '2', name: 'Reset Windows', action: () => null }
        ]}
        onModelSelect={setActiveModel}
        onFullscreen={handleFullscreen}
      />

      <div className="windows-container">
        {windows.map(window => (
          <GridWindow
            key={window.id}
            config={window}
            onMove={() => null}
            onResize={() => null}
            onStateChange={(id, state) => {
              setWindows(prev => prev.map(w => 
                w.id === id ? { ...w, state: { ...w.state, ...state } } : w
              ));
            }}
          />
        ))}
      </div>

      <LayoutControl
        currentLayout={currentLayout}
        onLayoutChange={setCurrentLayout}
      />

      <UnifiedInput
        currentTarget={activeModel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MainLayout;
