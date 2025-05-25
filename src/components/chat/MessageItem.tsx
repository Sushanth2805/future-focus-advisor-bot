
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  audioContent?: string;
}

interface MessageItemProps {
  message: Message;
  currentlyPlaying: string | null;
  onPlayAudio: (audioContent: string, messageId: string) => void;
}

const MessageItem = ({ message, currentlyPlaying, onPlayAudio }: MessageItemProps) => {
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
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs ${
              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
            {message.sender === 'ai' && message.audioContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPlayAudio(message.audioContent!, message.id)}
                className="p-1 h-6 w-6"
              >
                {currentlyPlaying === message.id ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessageItem;
