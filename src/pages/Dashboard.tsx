import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Welcome from '@/components/dashboard/Welcome';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import ApplicationStats from '@/components/dashboard/ApplicationStats';
import ApplicationList from '@/components/dashboard/ApplicationList';
import ApplicationTimeline from '@/components/dashboard/ApplicationTimeline';
import ApplicationProgress from '@/components/dashboard/ApplicationProgress';
import ApplicationTips from '@/components/dashboard/ApplicationTips';
import ResumeViewer from '@/components/dashboard/ResumeViewer';

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
  const totalApplications = applications.length;
  const interviews = applications.filter(app => app.status === "Interview").length;
  const offers = applications.filter(app => app.status === "Offer").length;
  const rejections = applications.filter(app => app.status === "Rejected").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Welcome />
        <ProfileSummary />
        <ResumeViewer />

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

        <ApplicationStats 
          totalApplications={totalApplications}
          interviews={interviews}
          offers={offers}
          rejections={rejections}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ApplicationList applications={applications} />
            <ApplicationTimeline applications={applications} />
          </div>
          
          <div className="lg:col-span-1">
            <ApplicationProgress 
              totalApplications={totalApplications}
              interviews={interviews}
              offers={offers}
              rejections={rejections}
            />
            <ApplicationTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
