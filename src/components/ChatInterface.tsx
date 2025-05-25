
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import AudioPlayer from './chat/AudioPlayer';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  audioContent?: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI career counselor. I'm here to help you explore career paths, discuss your interests, and provide guidance on your professional journey. What would you like to talk about today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Save chat session whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the initial message
      saveChatSession();
    }
  }, [messages]);

  const saveChatSession = async () => {
    try {
      await supabase.functions.invoke('save-chat-session', {
        body: {
          sessionId,
          messages: messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender,
            timestamp: msg.timestamp.toISOString()
          }))
        },
      });
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  };

  const handlePlayAudio = (audioContent: string, messageId: string) => {
    if (currentlyPlaying === messageId) {
      // Stop current audio
      setCurrentlyPlaying(null);
      return;
    }

    try {
      const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], {
        type: 'audio/mp3'
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.play();
      setCurrentlyPlaying(messageId);
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message: inputValue,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })),
          generateAudio: voiceEnabled
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to get AI response');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't generate a response. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        audioContent: data.audioContent
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAudioEnd = () => {
    setCurrentlyPlaying(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex flex-col">
      <ChatHeader 
        onBack={onBack}
        voiceEnabled={voiceEnabled}
        onVoiceToggle={() => setVoiceEnabled(!voiceEnabled)}
      />
      
      <MessageList
        messages={messages}
        isLoading={isLoading}
        currentlyPlaying={currentlyPlaying}
        onPlayAudio={handlePlayAudio}
      />
      
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />

      <AudioPlayer onAudioEnd={handleAudioEnd} />
    </div>
  );
};

export default ChatInterface;
