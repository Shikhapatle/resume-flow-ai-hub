import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import { FileText, Briefcase, CheckCircle, Clock, XCircle, PieChart, BarChart, LineChart, ArrowUpRight, BookOpen, Lightbulb, Target } from 'lucide-react';
import { generateRecommendation } from '@/utils/aiRecommendations';

const applications = [
  { 
    id: 1, 
    position: "Senior Frontend Developer", 
    company: "TechNova Inc", 
    status: "Applied", 
    date: "Sep 15, 2023",
    logo: "T"
  },
  { 
    id: 2, 
    position: "Full Stack Engineer", 
    company: "Digital Solutions", 
    status: "Interview", 
    date: "Sep 10, 2023",
    logo: "D"
  },
  { 
    id: 3, 
    position: "UI/UX Developer", 
    company: "Creative Minds", 
    status: "Rejected", 
    date: "Aug 28, 2023",
    logo: "C"
  },
  { 
    id: 4, 
    position: "Backend Developer", 
    company: "DataFlow Systems", 
    status: "Offer", 
    date: "Sep 8, 2023",
    logo: "D"
  }
];

const Dashboard = () => {
  const [personalSummary, setPersonalSummary] = useState<string>("");
  const [workSummary, setWorkSummary] = useState<string>("");
  const [educationSummary, setEducationSummary] = useState<string>("");
  const [skillsSummary, setSkillsSummary] = useState<string>("");

  const totalApplications = applications.length;
  const interviews = applications.filter(app => app.status === "Interview").length;
  const offers = applications.filter(app => app.status === "Offer").length;
  const rejections = applications.filter(app => app.status === "Rejected").length;

  useEffect(() => {
    const generateSummaries = async () => {
      try {
        const personalQuery = "summary of a software professional's personal profile";
        const workQuery = "summary of relevant work experience in tech";
        const educationQuery = "summary of educational background";
        const skillsQuery = "summary of technical and soft skills";

        const [personal, work, education, skills] = await Promise.all([
          generateRecommendation({ query: personalQuery }),
          generateRecommendation({ query: workQuery }),
          generateRecommendation({ query: educationQuery }),
          generateRecommendation({ query: skillsQuery })
        ]);

        setPersonalSummary(personal);
        setWorkSummary(work);
        setEducationSummary(education);
        setSkillsSummary(skills);
      } catch (error) {
        console.error('Error generating summaries:', error);
      }
    };

    generateSummaries();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              AI-Generated Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Personal Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[100px]">
                    <p className="text-sm text-muted-foreground">{personalSummary}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[100px]">
                    <p className="text-sm text-muted-foreground">{workSummary}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[100px]">
                    <p className="text-sm text-muted-foreground">{educationSummary}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Skills Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[100px]">
                    <p className="text-sm text-muted-foreground">{skillsSummary}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Application Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your job applications and progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              View Resume
            </Button>
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" />
              Find More Jobs
            </Button>
          </div>
        </div>
        
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
          </div>
          
          <div className="lg:col-span-1">
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
                      <div className="text-sm text-muted-foreground">{applications.filter(a => a.status === "Applied").length}/{totalApplications}</div>
                    </div>
                    <Progress value={applications.filter(a => a.status === "Applied").length / totalApplications * 100} className="h-2" />
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
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Resume Optimization</h3>
                    <p className="text-sm text-muted-foreground">Try tailoring your resume to match job descriptions. Our AI suggests that adding more industry-specific keywords could increase your match rate by 25%.</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Interview Preparation</h3>
                    <p className="text-sm text-muted-foreground">Your next interview is scheduled with Digital Solutions. We recommend preparing for technical questions on React and Node.js.</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Job Market Trends</h3>
                    <p className="text-sm text-muted-foreground">Remote developer jobs have increased by 15% in your area. Consider highlighting your remote work experience in applications.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
