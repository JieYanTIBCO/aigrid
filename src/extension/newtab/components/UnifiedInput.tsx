import React, { useState, useRef, useEffect } from 'react';
import LayoutControl from './LayoutControl';
import { LayoutType } from '../LayoutSelector';

interface UnifiedInputProps {
  onSubmit: (text: string, target: string) => void;
  currentTarget: string;
  isLoading?: boolean;
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const MAX_LINES = 5;
const LINE_HEIGHT = 36;

const UnifiedInput: React.FC<UnifiedInputProps> = ({ 
  onSubmit, 
  currentTarget,
  isLoading = false,
  currentLayout,
  onLayoutChange
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateHeight = () => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    
    // Reset height to single line
    textarea.style.height = `${LINE_HEIGHT}px`;
    
    // Only expand if content exceeds one line
    if (textarea.scrollHeight > LINE_HEIGHT) {
      const newHeight = Math.min(
        textarea.scrollHeight,
        LINE_HEIGHT * MAX_LINES
      );
      textarea.style.height = `${newHeight}px`;
      document.documentElement.style.setProperty(
        '--unified-input-height',
        `${newHeight + 16}px`
      );
    } else {
      document.documentElement.style.setProperty(
        '--unified-input-height',
        `${LINE_HEIGHT + 16}px`
      );
    }
  };

  useEffect(() => {
    // Set initial height and CSS variable
    if (textareaRef.current) {
      textareaRef.current.style.height = `${LINE_HEIGHT}px`;
      document.documentElement.style.setProperty(
        '--line-height',
        `${LINE_HEIGHT}px`
      );
    }
  }, []);

  useEffect(() => {
    updateHeight();
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    onSubmit(inputValue.trim(), currentTarget);
    setInputValue('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = `${LINE_HEIGHT}px`;
    }
    document.documentElement.style.setProperty(
      '--unified-input-height',
      `${LINE_HEIGHT + 16}px`
    );
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
      setInputValue(lines.slice(-MAX_LINES).join('\n'));
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div className="unified-input">
      <form onSubmit={handleSubmit} className="input-form">
        <LayoutControl 
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
        <div className="input-right">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="input-textarea"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="submit-button"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnifiedInput;
