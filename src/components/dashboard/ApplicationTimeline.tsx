
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

interface Application {
  id: number;
  position: string;
  company: string;
  status: string;
  date: string;
}

interface ApplicationTimelineProps {
  applications: Application[];
}

const ApplicationTimeline = ({ applications }: ApplicationTimelineProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Application Timeline</span>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <LineChart className="h-3 w-3" />
            View Trends
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {applications.map(app => (
            <div key={app.id} className="relative pl-6 pb-6 border-l border-border last:border-l-0 last:pb-0">
              <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-primary"></div>
              <div className="mb-1">
                <span className="font-medium">{app.position}</span>
                <span className="text-muted-foreground"> at </span>
                <span className="font-medium">{app.company}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  app.status === "Applied" ? "bg-blue-100 text-blue-800" : 
                  app.status === "Interview" ? "bg-purple-100 text-purple-800" : 
                  app.status === "Offer" ? "bg-green-100 text-green-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {app.status}
                </span>
                <span className="text-xs text-muted-foreground">{app.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTimeline;
