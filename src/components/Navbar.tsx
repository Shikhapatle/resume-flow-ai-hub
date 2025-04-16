
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Search, BarChart3, Shield } from 'lucide-react';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");
  }, []);

  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-2xl">ResumeFlow</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
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
            
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>
            )}
            
            {isAdmin ? (
              <Link to="/login">
                <Button variant="outline" onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  localStorage.removeItem("userRole");
                  window.location.href = "/";
                }}>Logout</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
