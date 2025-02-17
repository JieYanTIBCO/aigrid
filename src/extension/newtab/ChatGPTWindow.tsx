import React, { useState, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatGPTWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = {
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);
    scrollToBottom();

    try {
      // TODO: Implement actual ChatGPT API call
      // For now, just simulate a response
      setTimeout(() => {
        const response: Message = {
          role: 'assistant',
          content: `Echo: ${newMessage.content}`
        };
        setMessages(prev => [...prev, response]);
        setIsLoading(false);
        scrollToBottom();
      }, 1000);
    } catch (error) {
      console.error('Failed to get response:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="chatgpt-window">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="chat-submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatGPTWindow;
