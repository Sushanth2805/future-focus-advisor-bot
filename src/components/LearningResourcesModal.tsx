
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Video, FileText, Clock, Star } from 'lucide-react';

interface LearningResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const learningResources = {
  courses: [
    {
      title: "Complete Web Development Bootcamp",
      provider: "Udemy",
      duration: "65 hours",
      rating: 4.7,
      level: "Beginner",
      description: "Learn HTML, CSS, JavaScript, React, and more in this comprehensive course.",
      link: "#"
    },
    {
      title: "Data Science and Machine Learning",
      provider: "Coursera",
      duration: "40 hours",
      rating: 4.8,
      level: "Intermediate",
      description: "Master Python, pandas, scikit-learn, and machine learning fundamentals.",
      link: "#"
    },
    {
      title: "UX/UI Design Fundamentals",
      provider: "Skillshare",
      duration: "25 hours",
      rating: 4.6,
      level: "Beginner",
      description: "Learn design principles, prototyping, and user research methods.",
      link: "#"
    }
  ],
  articles: [
    {
      title: "10 Career Pivoting Strategies That Actually Work",
      source: "Harvard Business Review",
      readTime: "8 min read",
      category: "Career Development",
      description: "Practical advice for making successful career transitions.",
      link: "#"
    },
    {
      title: "The Future of Remote Work in Tech",
      source: "TechCrunch",
      readTime: "12 min read", 
      category: "Industry Trends",
      description: "How remote work is reshaping the technology industry.",
      link: "#"
    },
    {
      title: "Building Your Personal Brand Online",
      source: "LinkedIn Learning",
      readTime: "15 min read",
      category: "Professional Development",
      description: "Tips for creating a strong online professional presence.",
      link: "#"
    }
  ],
  videos: [
    {
      title: "Day in the Life: Software Engineer at Google",
      channel: "Tech Career Stories",
      duration: "12:34",
      views: "2.1M views",
      description: "An inside look at what it's really like working at a top tech company.",
      link: "#"
    },
    {
      title: "How to Ace Your Technical Interview",
      channel: "Coding Interview Pro",
      duration: "45:12", 
      views: "892K views",
      description: "Comprehensive guide to preparing for technical interviews.",
      link: "#"
    },
    {
      title: "Negotiating Your Salary: Do's and Don'ts",
      channel: "Career Coach",
      duration: "18:45",
      views: "1.5M views",
      description: "Expert tips on how to negotiate better compensation packages.",
      link: "#"
    }
  ]
};

const LearningResourcesModal = ({ isOpen, onClose, userName }: LearningResourcesModalProps) => {
  const [selectedTab, setSelectedTab] = useState("courses");

  const getGreeting = () => {
    const name = userName ? userName.split('@')[0] : 'there';
    return `Hey ${name}! 👋`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Learning Resources</DialogTitle>
          <p className="text-gray-600">{getGreeting()} Here are some curated resources to boost your career.</p>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            {learningResources.courses.map((course, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{course.provider}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={course.level === 'Beginner' ? 'secondary' : 'default'}>
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <Button className="w-full" onClick={() => window.open(course.link, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            {learningResources.articles.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>{article.source}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <Button variant="outline" className="w-full" onClick={() => window.open(article.link, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {learningResources.videos.map((video, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>{video.channel}</span>
                    <span>{video.duration}</span>
                    <span>{video.views}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <Button variant="outline" className="w-full" onClick={() => window.open(video.link, '_blank')}>
                    <Video className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LearningResourcesModal;
