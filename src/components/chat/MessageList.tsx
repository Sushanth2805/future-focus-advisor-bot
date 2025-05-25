
import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import LoadingMessage from './LoadingMessage';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  audioContent?: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentlyPlaying: string | null;
  onPlayAudio: (audioContent: string, messageId: string) => void;
}

const MessageList = ({ messages, isLoading, currentlyPlaying, onPlayAudio }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            currentlyPlaying={currentlyPlaying}
            onPlayAudio={onPlayAudio}
          />
        ))}
        {isLoading && <LoadingMessage />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
