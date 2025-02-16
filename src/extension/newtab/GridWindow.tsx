import React from 'react';

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

interface GridWindowProps {
  config: WindowConfig;
  onResize: (id: string, position: WindowConfig['position']) => void;
  onMove: (id: string, position: Pick<WindowConfig['position'], 'x' | 'y'>) => void;
  onStateChange: (id: string, state: Partial<WindowConfig['state']>) => void;
}

const GridWindow: React.FC<GridWindowProps> = ({
  config,
  onResize,
  onMove,
  onStateChange,
}) => {
  const { id, position, state, service } = config;
  const windowRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (!windowRef.current) return;
    
    const startPosition = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      onMove(id, {
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, position, onMove]);

  return (
    <div
      ref={windowRef}
      className="grid-window"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        zIndex: state.zIndex,
        transform: state.isMinimized ? 'scale(0.8)' : 'scale(1)',
        opacity: state.isActive ? 1 : 0.8,
        transition: 'transform 0.2s, opacity 0.2s',
      }}
      onMouseDown={(e) => {
        if (!state.isMinimized) {
          handleMouseDown(e);
          onStateChange(id, { isActive: true, zIndex: Date.now() });
        }
      }}
    >
      <div className="grid-window-header">
        <span className="grid-window-title">{service}</span>
        <div className="grid-window-controls">
          <button
            onClick={() => onStateChange(id, { isMinimized: !state.isMinimized })}
          >
            {state.isMinimized ? '□' : '—'}
          </button>
        </div>
      </div>
      <div className="grid-window-content">
        {/* Service-specific content will be rendered here */}
        {service === 'chatgpt' && <div>ChatGPT Window</div>}
        {service === 'claude' && <div>Claude Window</div>}
        {service === 'custom' && <div>Custom AI Window</div>}
      </div>
      <div 
        className="grid-window-resize"
        onMouseDown={(e) => {
          e.stopPropagation();
          const startSize = {
            width: position.width,
            height: position.height,
          };
          const startPos = {
            x: e.clientX,
            y: e.clientY,
          };

          const handleMouseMove = (e: MouseEvent) => {
            onResize(id, {
              ...position,
              width: Math.max(200, startSize.width + (e.clientX - startPos.x)),
              height: Math.max(200, startSize.height + (e.clientY - startPos.y)),
            });
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      />
    </div>
  );
};

export default GridWindow;
