
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
}

const ChatInput = ({ value, onChange, onSend, onKeyPress, disabled }: ChatInputProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto flex space-x-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about careers, skills, or your professional journey..."
          className="flex-1 min-h-[50px] max-h-[120px] resize-none"
          disabled={disabled}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          size="lg"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
