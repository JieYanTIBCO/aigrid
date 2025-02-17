import React, { useState, useRef, useCallback } from 'react';

interface ModelConfig {
  id: string;
  name: string;
  icon: string;
}

interface Shortcut {
  id: string;
  name: string;
  action: () => void;
}

interface SidePanelProps {
  models: ModelConfig[];
  shortcuts: Shortcut[];
  onModelSelect: (modelId: string) => void;
  onFullscreen: (modelId: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  models,
  shortcuts,
  onModelSelect,
  onFullscreen
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.pageX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(400, startWidth + (e.pageX - startX)));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isResizing, width]);

  return (
    <div 
      ref={panelRef}
      className="side-panel"
      style={{ 
        width: isExpanded ? `${width}px` : '40px',
        transition: isResizing ? 'none' : 'width 0.3s ease'
      }}
    >
      <div className="side-panel-header">
        <button 
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
        {isExpanded && <h2>Settings</h2>}
      </div>

      {isExpanded && (
        <div className="side-panel-content">
          <section className="models-section">
            <h3>Models</h3>
            {models.map(model => (
              <div key={model.id} className="model-item">
                <img src={model.icon} alt={model.name} className="model-icon" />
                <span>{model.name}</span>
                <button onClick={() => onFullscreen(model.id)}>⛶</button>
              </div>
            ))}
          </section>

          <section className="shortcuts-section">
            <h3>Shortcuts</h3>
            {shortcuts.map(shortcut => (
              <button
                key={shortcut.id}
                className="shortcut-button"
                onClick={shortcut.action}
              >
                {shortcut.name}
              </button>
            ))}
          </section>
        </div>
      )}

      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default SidePanel;
