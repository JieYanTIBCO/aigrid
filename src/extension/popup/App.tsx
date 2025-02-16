import React, { useEffect, useState } from 'react';
import { chatGPTManager } from '../background/auth';

const ChatGPTApp: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    chatGPTManager.authenticate().catch((error) => {
      console.error('Authentication failed:', error);
    });
  }, []);

  const handleSendMessage = async () => {
    try {
      const res = await chatGPTManager.sendMessage(message);
      setResponse(res);
    } catch (error) {
      console.error('Message send failed:', error);
    }
  };

  return (
    <div>
      <h1>ChatGPT Integration</h1>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
      <pre>{response}</pre>
    </div>
  );
};

export default ChatGPTApp;
