import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobFilters from '@/components/job-finder/JobFilters';
import Navbar from '@/components/Navbar';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Briefcase as BriefcaseIcon, 
  MapPin, 
  Clock, 
  Building, 
  DollarSign,
  BookmarkPlus,
  Sparkles,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechNova Inc",
    location: "San Francisco, CA (Remote)",
    postedDate: "2 days ago",
    salary: "$120K - $150K",
    description: "We're looking for a Senior Frontend Developer with strong React skills to join our growing team...",
    skills: ["React", "TypeScript", "Redux", "CSS"],
    matchScore: 95
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Digital Solutions",
    location: "New York, NY (Hybrid)",
    postedDate: "1 week ago",
    salary: "$110K - $140K",
    description: "Join our engineering team to build world-class applications using modern technologies...",
    skills: ["JavaScript", "Node.js", "MongoDB", "React"],
    matchScore: 88
  },
  {
    id: 3,
    title: "UI/UX Developer",
    company: "Creative Minds",
    location: "Austin, TX (On-site)",
    postedDate: "3 days ago",
    salary: "$90K - $120K",
    description: "Looking for a talented UI/UX Developer to create beautiful and functional interfaces...",
    skills: ["Figma", "HTML", "CSS", "JavaScript"],
    matchScore: 82
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "DataFlow Systems",
    location: "Seattle, WA (Remote)",
    postedDate: "Just now",
    salary: "$115K - $145K",
    description: "Join our backend team to develop scalable and efficient APIs and services...",
    skills: ["Python", "Django", "PostgreSQL", "API Design"],
    matchScore: 78
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Innovations",
    location: "Chicago, IL (Remote)",
    postedDate: "5 days ago",
    salary: "$125K - $155K",
    description: "We need a DevOps Engineer to help us automate our infrastructure and deployment processes...",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    matchScore: 72
  }
];

const JobFinder = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState(sampleJobs);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    experienceLevel: '',
    employmentType: '',
    locationType: '',
    salary: 50
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setLoading(true);
    
    // Simulate API call with filters
    setTimeout(() => {
      const filtered = sampleJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.company.toLowerCase().includes(term.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(term.toLowerCase()));
          
        const matchesExperience = !filters.experienceLevel || job.title.toLowerCase().includes(filters.experienceLevel);
        const matchesType = !filters.employmentType || job.location.toLowerCase().includes(filters.employmentType);
        const matchesLocation = !filters.locationType || job.location.toLowerCase().includes(filters.locationType);
        const matchesSalary = parseInt(job.salary.replace(/[^0-9]/g, '')) >= filters.salary * 1000;
        
        return matchesSearch && matchesExperience && matchesType && matchesLocation && matchesSalary;
      });
      
      setJobs(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    handleSearch(searchTerm);
  };

  const handleSaveJob = (jobId: number) => {
    toast({
      title: "Job Saved",
      description: "This job has been saved to your bookmarks",
    });
  };

  const handleApplyJob = (jobId: number) => {
    toast({
      title: "Application Started",
      description: "You've started the application process for this job",
    });
  };

  const handleMatchJobs = () => {
    setLoading(true);
    // Simulate AI matching
    setTimeout(() => {
      setJobs([...sampleJobs].sort((a, b) => b.matchScore - a.matchScore));
      setLoading(false);
      toast({
        title: "Jobs Matched with Your Resume",
        description: "We've analyzed your resume and found the best matches",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Finder</h1>
            <p className="text-muted-foreground mt-1">Find your perfect job match powered by AI</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <JobFilters 
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                searchTerm={searchTerm}
                loading={loading}
              />
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="matches">
              <TabsList className="mb-4">
                <TabsTrigger value="matches">
                  Best Matches
                </TabsTrigger>
                <TabsTrigger value="recent">
                  Recent Jobs
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved Jobs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="mt-0">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-muted-foreground">Finding your perfect job matches...</p>
                    </div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-20">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map(job => (
                      <Card key={job.id} className="overflow-hidden">
                        <div className={`h-1 ${job.matchScore > 90 ? 'bg-green-500' : job.matchScore > 80 ? 'bg-primary' : 'bg-amber-500'}`}></div>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                <Building className="h-4 w-4" />
                                <span>{job.company}</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSaveJob(job.id)} 
                              className="text-muted-foreground hover:text-primary"
                            >
                              <BookmarkPlus className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex flex-wrap gap-y-2 text-sm text-muted-foreground mb-4">
                            <div className="w-1/2 flex items-center gap-1">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span>{job.location}</span>
                            </div>
                            <div className="w-1/2 flex items-center gap-1">
                              <Clock className="h-4 w-4 shrink-0" />
                              <span>{job.postedDate}</span>
                            </div>
                            <div className="w-1/2 flex items-center gap-1">
                              <DollarSign className="h-4 w-4 shrink-0" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="w-1/2 flex items-center gap-1">
                              <Sparkles className="h-4 w-4 shrink-0" />
                              <span>{job.matchScore}% Match</span>
                            </div>
                          </div>
                          
                          <p className="text-sm mb-3">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.map(skill => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </CardContent>
                        <Separator />
                        <CardFooter className="pt-3 flex justify-between">
                          <Button variant="outline" onClick={() => handleSaveJob(job.id)}>
                            Save Job
                          </Button>
                          <Button onClick={() => handleApplyJob(job.id)}>
                            Apply Now
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <div className="text-center py-20">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Recent Jobs</h3>
                  <p className="text-muted-foreground mb-6">Check back later for new job listings</p>
                </div>
              </TabsContent>
              
              <TabsContent value="saved" className="mt-0">
                <div className="text-center py-20">
                  <BookmarkPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
                  <p className="text-muted-foreground mb-6">Jobs you save will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFinder;
