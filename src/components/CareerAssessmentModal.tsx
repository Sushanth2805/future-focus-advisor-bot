import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, CheckCircle } from 'lucide-react';

interface CareerAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onAssessmentComplete?: (results: any) => void;
}

const assessmentQuestions = [
  {
    id: 1,
    question: "What type of work environment do you prefer?",
    options: [
      "Collaborative team settings",
      "Independent work",
      "Mix of both",
      "Client-facing roles"
    ]
  },
  {
    id: 2,
    question: "Which skills do you want to develop most?",
    options: [
      "Technical/Programming",
      "Creative/Design",
      "Leadership/Management",
      "Communication/Sales"
    ]
  },
  {
    id: 3,
    question: "What motivates you most in your career?",
    options: [
      "Financial success",
      "Creative fulfillment",
      "Making an impact",
      "Work-life balance"
    ]
  },
  {
    id: 4,
    question: "Which industry interests you most?",
    options: [
      "Technology/Software",
      "Healthcare/Medicine",
      "Business/Finance",
      "Creative/Media"
    ]
  }
];

const CareerAssessmentModal = ({ isOpen, onClose, userName, onAssessmentComplete }: CareerAssessmentModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [assessmentQuestions[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const results = {
        answers: newAnswers,
        careerPath: getCareerRecommendation(newAnswers),
        timestamp: new Date().toISOString()
      };
      
      // Store results in localStorage for persistence
      localStorage.setItem('assessmentResults', JSON.stringify(results));
      
      if (onAssessmentComplete) {
        onAssessmentComplete(results);
      }
      
      setIsComplete(true);
    }
  };

  const getCareerRecommendation = (assessmentAnswers = answers) => {
    // Simple logic to provide personalized recommendations
    const skillPreference = assessmentAnswers[2];
    const industryPreference = assessmentAnswers[4];
    
    if (skillPreference?.includes('Technical') && industryPreference?.includes('Technology')) {
      return "Software Developer";
    } else if (skillPreference?.includes('Creative') && industryPreference?.includes('Creative')) {
      return "UX/UI Designer";
    } else if (skillPreference?.includes('Leadership') && industryPreference?.includes('Business')) {
      return "Project Manager";
    } else {
      return "Marketing Specialist";
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isComplete ? 'Your Career Assessment Results' : 'Career Assessment'}
          </DialogTitle>
        </DialogHeader>

        {!isComplete ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {assessmentQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between text-left h-auto p-4"
                    onClick={() => handleAnswer(option)}
                  >
                    <span>{option}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Great job{userName ? `, ${userName.split('@')[0]}` : ''}! 🎉
              </h3>
              
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Recommended Career Path:</h4>
                  <p className="text-xl text-blue-600 font-medium">{getCareerRecommendation()}</p>
                </CardContent>
              </Card>

              <p className="text-gray-600">
                Based on your responses, this career path aligns well with your preferences and goals. 
                Consider exploring learning resources and networking opportunities in this field.
              </p>

              <div className="flex space-x-3">
                <Button onClick={resetAssessment} variant="outline">
                  Take Again
                </Button>
                <Button onClick={onClose} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Explore Resources
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareerAssessmentModal;
