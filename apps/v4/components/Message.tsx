import React from 'react';

type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

const Message: React.FC<MessageProps> = ({ role, content }) => {
  return (
    <div className={`message ${role}`}>
      <div className="avatar">{role === 'user' ? '👤' : '🤖'}</div>
      <div className="content">{content}</div>
    </div>
  );
};

export default Message;