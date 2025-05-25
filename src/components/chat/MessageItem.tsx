
import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
            : ''
        }`}>
          {message.sender === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        <Card className={`p-4 ${
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className={`text-xs mt-2 ${
            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MessageItem;
