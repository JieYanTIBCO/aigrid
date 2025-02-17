import React, { useState, useRef, useEffect } from 'react';

interface UnifiedInputProps {
  onSubmit: (text: string, target: string) => void;
  currentTarget: string;
  isLoading?: boolean;
}

const MAX_LINES = 5;
const MIN_HEIGHT = 50;
const MAX_HEIGHT = 150;

const UnifiedInput: React.FC<UnifiedInputProps> = ({ 
  onSubmit, 
  currentTarget,
  isLoading = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [height, setHeight] = useState(MIN_HEIGHT);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateHeight = () => {
    if (!textareaRef.current) return;

    // Reset height to auto to get proper scrollHeight
    textareaRef.current.style.height = 'auto';
    
    // Calculate new height
    const lines = textareaRef.current.value.split('\n');
    const newHeight = Math.min(
      Math.max(
        MIN_HEIGHT,
        Math.min(
          textareaRef.current.scrollHeight,
          MAX_HEIGHT
        )
      ),
      lines.length > MAX_LINES ? MAX_HEIGHT : MAX_HEIGHT
    );

    setHeight(newHeight);
    textareaRef.current.style.height = `${newHeight}px`;

    // Update CSS variable for layout adjustments
    document.documentElement.style.setProperty(
      '--unified-input-height',
      `${newHeight + 32}px` // Add padding
    );
  };

  useEffect(() => {
    updateHeight();
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    onSubmit(inputValue.trim(), currentTarget);
    setInputValue('');
    setHeight(MIN_HEIGHT);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = `${MIN_HEIGHT}px`;
    }
    document.documentElement.style.setProperty('--unified-input-height', `${MIN_HEIGHT + 32}px`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const lines = newValue.split('\n');
    
    if (lines.length > MAX_LINES) {
      // Keep only the last MAX_LINES lines
      setInputValue(lines.slice(-MAX_LINES).join('\n'));
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div 
      className="unified-input"
      style={{ '--input-height': `${height}px` } as React.CSSProperties}
    >
      <div className="model-selector">
        <div className="active-model">
          To: {currentTarget}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
          className="input-textarea"
          style={{ height: `${height}px` }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="submit-button"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default UnifiedInput;
