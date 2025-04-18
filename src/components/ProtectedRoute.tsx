
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user' 
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate("/login");
      return;
    }
    
    if (requiredRole && userRole !== requiredRole) {
      toast.error(`You need ${requiredRole} access to view this page`);
      navigate("/");
      return;
    }
  }, [navigate, requiredRole]);
  
  return <>{children}</>;
};

export default ProtectedRoute;
