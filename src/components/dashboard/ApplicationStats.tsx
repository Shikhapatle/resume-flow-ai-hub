
import { ArrowUpRight, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicationStatsProps {
  totalApplications: number;
  interviews: number;
  offers: number;
  rejections: number;
}

const ApplicationStats = ({ totalApplications, interviews, offers, rejections }: ApplicationStatsProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full p-2 bg-blue-100">
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <div className="ml-auto flex items-center text-green-600 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>10%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Interview Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full p-2 bg-purple-100">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{Math.round((interviews / totalApplications) * 100)}%</div>
            <div className="ml-auto flex items-center text-green-600 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Offer Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full p-2 bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{Math.round((offers / totalApplications) * 100)}%</div>
            <div className="ml-auto flex items-center text-green-600 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>12%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rejection Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full p-2 bg-red-100">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold">{Math.round((rejections / totalApplications) * 100)}%</div>
            <div className="ml-auto flex items-center text-red-600 text-sm">
              <ArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
              <span>3%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStats;
