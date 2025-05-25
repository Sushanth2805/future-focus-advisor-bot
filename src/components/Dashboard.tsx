import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, User, BarChart3, BookOpen, LogOut } from "lucide-react";
import ChatInterface from "./ChatInterface";
import CareerAssessmentModal from "./CareerAssessmentModal";
import LearningResourcesModal from "./LearningResourcesModal";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResources, setShowResources] = useState(false);
  type AssessmentResults = {
    careerPath: string;
    // Add other properties as needed based on your assessment result structure
  };
  
    const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);

  useEffect(() => {
    // Load assessment results from localStorage on component mount
    const savedResults = localStorage.getItem("assessmentResults");
    if (savedResults) {
      setAssessmentResults(JSON.parse(savedResults));
    }
  }, []);

  const handleAssessmentComplete = (results: AssessmentResults) => {
    setAssessmentResults(results);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back!
                </h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI Chat Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">AI Career Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Chat with our AI counselor to get instant career advice and
                guidance
              </p>
              <Button
                onClick={() =>
                  window.open("https://dream2-theta.vercel.app/", "_blank")
                }
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                size="lg"
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* Career Assessment Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Career Assessment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                {assessmentResults
                  ? "Retake our assessment to update your career recommendations"
                  : "Take our comprehensive assessment to discover your ideal career path"}
              </p>
              <Button
                onClick={() => setShowAssessment(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="lg"
              >
                {assessmentResults ? "Retake Assessment" : "Take Assessment"}
              </Button>
            </CardContent>
          </Card>

          {/* Learning Resources Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Learning Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                {assessmentResults
                  ? `Access curated resources for ${assessmentResults.careerPath} and career development`
                  : "Access curated courses and materials for your career development"}
              </p>
              <Button
                onClick={() => setShowResources(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                size="lg"
              >
                Explore Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {assessmentResults ? "1" : "0"}
              </div>
              <div className="text-gray-600">Assessments Taken</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Chat Sessions</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-gray-600">Resources Viewed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CareerAssessmentModal
        isOpen={showAssessment}
        onClose={() => setShowAssessment(false)}
        userName={user?.email}
        onAssessmentComplete={handleAssessmentComplete}
      />

      <LearningResourcesModal
        isOpen={showResources}
        onClose={() => setShowResources(false)}
        userName={user?.email}
        assessmentResults={assessmentResults}
      />
    </div>
  );
};

export default Dashboard;
