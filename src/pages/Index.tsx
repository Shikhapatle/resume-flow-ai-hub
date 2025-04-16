
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { FileText, Briefcase, Zap, Sparkles, FileSearch, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Career Journey <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-lg mb-8 text-muted-foreground">
              Create stunning resumes and find your perfect job match with our AI-driven platform.
              Let advanced algorithms enhance your career prospects.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/resume-builder">
                <Button size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Build Your Resume
                </Button>
              </Link>
              <Link to="/job-finder">
                <Button size="lg" variant="outline" className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Resume and career illustration" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Leverage cutting-edge AI to build your perfect resume and find your ideal job match
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Resume Generator</h3>
                <p className="text-muted-foreground">
                  Generate professional resume content using advanced AI models. Get suggestions for improvements and optimize your resume for each job.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <FileSearch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Job Matching</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your resume and matches you with jobs that fit your skills and experience. Get personalized job recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
                <p className="text-muted-foreground">
                  Track your job applications and get insights on your progress. Monitor your application status and follow up effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-primary rounded-xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to elevate your career?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of professionals who have found their dream jobs with ResumeFlow
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                <Zap className="h-5 w-5" />
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">ResumeFlow</h3>
              <p className="text-secondary-foreground/70">
                AI-powered resume building and job matching for modern professionals
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/resume-builder" className="text-secondary-foreground/70 hover:text-white">Resume Builder</Link></li>
                <li><Link to="/job-finder" className="text-secondary-foreground/70 hover:text-white">Job Finder</Link></li>
                <li><Link to="/dashboard" className="text-secondary-foreground/70 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-secondary-foreground/20 text-center text-secondary-foreground/60">
            <p>© {new Date().getFullYear()} ResumeFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
