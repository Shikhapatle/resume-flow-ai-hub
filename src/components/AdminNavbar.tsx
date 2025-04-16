
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Search, BarChart3, Shield } from 'lucide-react';

const AdminNavbar = () => {
  return (
    <nav className="border-b border-border bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-2xl">ResumeFlow</span>
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">Admin</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Button>
            </Link>
            <Link to="/resume-builder">
              <Button variant="ghost" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Resume Builder</span>
              </Button>
            </Link>
            <Link to="/job-finder">
              <Button variant="ghost" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Job Finder</span>
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
