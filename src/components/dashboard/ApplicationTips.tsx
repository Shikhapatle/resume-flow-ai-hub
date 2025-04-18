
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ApplicationTips = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Application Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Resume Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Try tailoring your resume to match job descriptions. Our AI suggests that adding more industry-specific keywords could increase your match rate by 25%.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Interview Preparation</h3>
            <p className="text-sm text-muted-foreground">
              Your next interview is scheduled with Digital Solutions. We recommend preparing for technical questions on React and Node.js.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Job Market Trends</h3>
            <p className="text-sm text-muted-foreground">
              Remote developer jobs have increased by 15% in your area. Consider highlighting your remote work experience in applications.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTips;
