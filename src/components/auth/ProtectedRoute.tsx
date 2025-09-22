import React from 'react';
import { useSelector } from 'react-redux';
import Login from '../login/Login';
import type { RootState } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Debug logging
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
