
import { FileText, Briefcase, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Welcome = () => {
  return (
    <Card className="mb-8 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to ResumeFlow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="rounded-full p-2 bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI-Powered Resume Builder</h3>
              <p className="text-sm text-muted-foreground">Create professional resumes with AI assistance. Get real-time suggestions and improvements.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="rounded-full p-2 bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Smart Job Matching</h3>
              <p className="text-sm text-muted-foreground">Find jobs that match your skills and experience. Get personalized job recommendations.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="rounded-full p-2 bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Application Tracking</h3>
              <p className="text-sm text-muted-foreground">Track your job applications and get insights on your progress. Never miss a follow-up.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Welcome;
