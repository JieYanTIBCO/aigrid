import React from 'react';
import { LayoutType } from '../LayoutSelector';

interface LayoutControlProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutControl: React.FC<LayoutControlProps> = ({
  currentLayout,
  onLayoutChange,
}) => {
  return (
    <div className="layout-control">
      <button
        className={`layout-icon-btn ${currentLayout === 'vertical-1-3' ? 'active' : ''}`}
        onClick={() => onLayoutChange('vertical-1-3')}
        title="Three Column Layout"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M3 3h6v18H3V3zm6 0h6v18H9V3zm6 0h6v18h-6V3z" fill="currentColor"/>
        </svg>
      </button>
      <button
        className={`layout-icon-btn ${currentLayout === 'vertical-1-2' ? 'active' : ''}`}
        onClick={() => onLayoutChange('vertical-1-2')}
        title="Two Column Layout"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M3 3h9v18H3V3zm9 0h9v18h-9V3z" fill="currentColor"/>
        </svg>
      </button>
      <button
        className={`layout-icon-btn ${currentLayout === 'grid-2x2' ? 'active' : ''}`}
        onClick={() => onLayoutChange('grid-2x2')}
        title="Grid Layout"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zm-10 10h8v8H3v-8zm10 0h8v8h-8v-8z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
};

export default LayoutControl;
