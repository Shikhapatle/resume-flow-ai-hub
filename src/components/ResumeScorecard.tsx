
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { scoreResume } from '@/utils/aiRecommendations';
import { useToast } from '@/components/ui/use-toast';

interface ResumeData {
  personalInfo?: any;
  workExperiences?: any[];
  education?: any[];
  skills?: any[];
  languages?: any[];
}

interface ResumeScorecardProps {
  resumeData: ResumeData;
}

const ResumeScorecard: React.FC<ResumeScorecardProps> = ({ resumeData }) => {
  const { toast } = useToast();
  const [isScoring, setIsScoring] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleScoreResume = async () => {
    if (Object.keys(resumeData).length === 0) {
      toast({
        title: "Resume Incomplete",
        description: "Please add some content to your resume before scoring.",
        variant: "destructive"
      });
      return;
    }

    setIsScoring(true);
    try {
      const result = await scoreResume(resumeData);
      setScore(result.score);
      setFeedback(result.feedback);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error scoring resume:", error);
      toast({
        title: "Scoring Failed",
        description: "Unable to score your resume. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsScoring(false);
    }
  };

  // Get color based on score
  const getScoreColor = () => {
    if (!score) return "text-gray-400";
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Resume Analysis
        </CardTitle>
        <CardDescription>
          Get professional feedback on your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        {score === null ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Our AI can analyze your resume and provide personalized feedback to help improve your chances of getting interviews.
            </p>
            <Button 
              onClick={handleScoreResume} 
              className="gap-2"
              disabled={isScoring}
            >
              <Sparkles className="h-4 w-4" />
              {isScoring ? "Analyzing Resume..." : "Analyze My Resume"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Resume Score</p>
                <p className={`text-3xl font-bold ${getScoreColor()}`}>
                  {score}/100
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleScoreResume}
                disabled={isScoring}
              >
                {isScoring ? "Refreshing..." : "Refresh Score"}
              </Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Feedback</h4>
              <p className="text-sm text-muted-foreground">{feedback}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    {score && score >= 80 ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="link" className="ml-auto gap-1">
          View Detailed Report <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeScorecard;
