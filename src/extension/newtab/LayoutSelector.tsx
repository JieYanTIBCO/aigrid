import React from 'react';

export type LayoutType = 'vertical-1-3' | 'vertical-1-2' | 'grid-2x2';

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ currentLayout, onLayoutChange }) => {
  return (
    <div className="layout-selector">
      <button 
        className={`layout-btn ${currentLayout === 'vertical-1-3' ? 'active' : ''}`}
        onClick={() => onLayoutChange('vertical-1-3')}
      >
        Vertical 1/3
      </button>
      <button 
        className={`layout-btn ${currentLayout === 'vertical-1-2' ? 'active' : ''}`}
        onClick={() => onLayoutChange('vertical-1-2')}
      >
        Vertical 1/2
      </button>
      <button 
        className={`layout-btn ${currentLayout === 'grid-2x2' ? 'active' : ''}`}
        onClick={() => onLayoutChange('grid-2x2')}
      >
        Grid 2x2
      </button>
    </div>
  );
};

export default LayoutSelector;
