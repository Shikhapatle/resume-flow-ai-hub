
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart } from 'lucide-react';

interface ApplicationProgressProps {
  totalApplications: number;
  interviews: number;
  offers: number;
  rejections: number;
}

const ApplicationProgress = ({ totalApplications, interviews, offers, rejections }: ApplicationProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Application Progress</span>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <BarChart className="h-3 w-3" />
            Details
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-sm">Applied</div>
              <div className="text-sm text-muted-foreground">
                {totalApplications - (interviews + offers + rejections)}/{totalApplications}
              </div>
            </div>
            <Progress 
              value={(totalApplications - (interviews + offers + rejections)) / totalApplications * 100} 
              className="h-2" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-sm">Interviewed</div>
              <div className="text-sm text-muted-foreground">{interviews}/{totalApplications}</div>
            </div>
            <Progress value={interviews / totalApplications * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-sm">Offers</div>
              <div className="text-sm text-muted-foreground">{offers}/{totalApplications}</div>
            </div>
            <Progress value={offers / totalApplications * 100} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-sm">Rejected</div>
              <div className="text-sm text-muted-foreground">{rejections}/{totalApplications}</div>
            </div>
            <Progress value={rejections / totalApplications * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationProgress;
