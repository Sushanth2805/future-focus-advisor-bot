
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface ChatHeaderProps {
  onBack: () => void;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
}

const ChatHeader = ({ onBack, voiceEnabled, onVoiceToggle }: ChatHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Career Counselor</h1>
              <p className="text-sm text-gray-600">Online</p>
            </div>
          </div>
        </div>
        
        <Button
          variant={voiceEnabled ? "default" : "outline"}
          size="sm"
          onClick={onVoiceToggle}
          className="flex items-center space-x-2"
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
