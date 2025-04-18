
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart } from 'lucide-react';

interface Application {
  id: number;
  position: string;
  company: string;
  status: string;
  date: string;
  logo: string;
}

interface ApplicationListProps {
  applications: Application[];
}

const ApplicationList = ({ applications }: ApplicationListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Application Status</span>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <PieChart className="h-3 w-3" />
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="flex items-center p-3 rounded-lg hover:bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                    {app.logo}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{app.position}</div>
                    <div className="text-sm text-muted-foreground">{app.company}</div>
                  </div>
                  <div className="text-right">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.status === "Applied" ? "bg-blue-100 text-blue-800" : 
                        app.status === "Interview" ? "bg-purple-100 text-purple-800" : 
                        app.status === "Offer" ? "bg-green-100 text-green-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{app.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="archived">
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No archived applications</h3>
                <p className="text-muted-foreground">Applications you archive will appear here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationList;
