
import React, { useState } from 'react';
import WelcomeSection from '../components/WelcomeSection';
import AssessmentFlow from '../components/AssessmentFlow';
import CareerResults from '../components/CareerResults';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'assessment' | 'results'>('welcome');
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});

  const handleStartAssessment = () => {
    setCurrentStep('assessment');
  };

  const handleAssessmentComplete = (responses: Record<string, any>) => {
    setUserResponses(responses);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setUserResponses({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {currentStep === 'welcome' && (
        <WelcomeSection onStart={handleStartAssessment} />
      )}
      {currentStep === 'assessment' && (
        <AssessmentFlow onComplete={handleAssessmentComplete} />
      )}
      {currentStep === 'results' && (
        <CareerResults responses={userResponses} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;
