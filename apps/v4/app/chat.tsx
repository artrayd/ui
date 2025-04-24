import React, { useState } from 'react';
import InputField from '../components/InputField';
import Message from '../components/Message';

type MessageType = {
  role: 'user' | 'assistant';
  content: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: MessageType = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    if (!response.body) {
      console.error('Response body is null');
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    const assistantMessage: MessageType = { role: 'assistant', content: '' };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantMessage.content += decoder.decode(value, { stream: true });
      setMessages((prev) => [...prev.slice(0, -1), assistantMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <Message role="assistant" content="Typing..." />}
      </div>
      <InputField onSend={sendMessage} />
    </div>
  );
};

export default Chat;