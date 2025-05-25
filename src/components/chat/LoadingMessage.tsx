
import React from 'react';
import { Card } from '@/components/ui/card';

const LoadingMessage = () => {
  return (
    <div className="flex justify-start">
      <div className="flex space-x-3 max-w-[80%]">
        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <Card className="p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoadingMessage;
