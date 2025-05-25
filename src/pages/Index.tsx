
import React, { useState } from 'react';
import AuthProvider from '@/components/AuthProvider';
import WelcomeScreen from '@/components/WelcomeScreen';
import VoiceAssessment from '@/components/VoiceAssessment';
import OptionAssessment from '@/components/OptionAssessment';
import CareerResults from '@/components/CareerResults';

type AppMode = 'welcome' | 'voice-assessment' | 'option-assessment' | 'results';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('welcome');
  const [assessmentResults, setAssessmentResults] = useState<Record<string, any>>({});

  const handleStartVoice = () => setCurrentMode('voice-assessment');
  const handleStartOptions = () => setCurrentMode('option-assessment');
  
  const handleAssessmentComplete = (results: Record<string, any>) => {
    setAssessmentResults(results);
    setCurrentMode('results');
  };

  const handleRestart = () => {
    setCurrentMode('welcome');
    setAssessmentResults({});
  };

  const handleBackToWelcome = () => setCurrentMode('welcome');

  return (
    <AuthProvider>
      <div className="min-h-screen">
        {currentMode === 'welcome' && (
          <WelcomeScreen 
            onStartVoice={handleStartVoice}
            onStartOptions={handleStartOptions}
          />
        )}
        
        {currentMode === 'voice-assessment' && (
          <VoiceAssessment 
            onComplete={handleAssessmentComplete}
            onBack={handleBackToWelcome}
          />
        )}
        
        {currentMode === 'option-assessment' && (
          <OptionAssessment 
            onComplete={handleAssessmentComplete}
            onBack={handleBackToWelcome}
          />
        )}
        
        {currentMode === 'results' && (
          <CareerResults 
            responses={assessmentResults}
            onRestart={handleRestart}
          />
        )}
      </div>
    </AuthProvider>
  );
};

export default Index;
