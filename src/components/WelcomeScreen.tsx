
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';

interface WelcomeScreenProps {
  onStartVoice: () => void;
  onStartOptions: () => void;
}

const WelcomeScreen = ({ onStartVoice, onStartOptions }: WelcomeScreenProps) => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleStartAssessment = (mode: 'voice' | 'options') => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    if (mode === 'voice') {
      onStartVoice();
    } else if (mode === 'options') {
      onStartOptions();
    }
  };

  const handleStartChat = () => {
  window.location.href = 'https://dream2-theta.vercel.app/';
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            AI Career Counselor
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Discover your ideal career path with AI-powered guidance
          </p>
          
          <p className="text-lg text-gray-600 mb-8">
            Choose your preferred interaction method and let's find your perfect career match
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
          <Card 
            className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white/80 backdrop-blur-sm border-0"
            onClick={() => handleStartAssessment('voice')}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Voice Assessment</h3>
            <p className="text-gray-600 mb-6">
              Have a natural conversation with our AI. Just speak your thoughts and let us guide you.
            </p>
            
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              size="lg"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Voice Chat
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-3">
              ~3 minutes • Natural conversation
            </p>
          </Card>

          <Card 
            className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white/80 backdrop-blur-sm border-0"
            onClick={() => handleStartAssessment('options')}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Quick Options</h3>
            <p className="text-gray-600 mb-6">
              Answer structured questions by selecting from options. Fast and focused.
            </p>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Choose Options
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-3">
              ~2 minutes • Multiple choice
            </p>
          </Card>

          <Card 
            className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white/80 backdrop-blur-sm border-0"
            onClick={handleStartChat}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Start Chat</h3>
            <p className="text-gray-600 mb-6">
              Have an open conversation with our AI career counselor. Ask questions freely.
            </p>
            
      <Button>
        onClick={() => window.location.href = 'https://dream2-theta.vercel.app/'}
        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
        size="lg"
      
        <MessageSquare className="w-5 h-5 mr-2" />
        Start Chat
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

            
            <p className="text-sm text-gray-500 mt-3">
              ~Open-ended • Free conversation
            </p>
          </Card>
        </div>

        {!user && (
          <p className="text-sm text-gray-500">
            Sign in to save your results and get personalized recommendations
          </p>
        )}

        <AuthModal 
          isOpen={showAuth} 
          onClose={() => setShowAuth(false)} 
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;
