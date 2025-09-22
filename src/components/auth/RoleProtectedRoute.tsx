import React from 'react';
import { Navigate } from 'react-router-dom';
import useRoleAccess, { type UserRole, type Permission } from '../../hooks/useRoleAccess';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermission?: Permission | null;
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  requiredPermission = null, 
  fallbackPath = '/unauthorized' 
}) => {
  const { hasRole, hasPermission, userRole } = useRoleAccess();

  // Check if user has required roles
  const hasRequiredRole = requiredRoles.length === 0 || hasRole(requiredRoles);

  // Check if user has required permission
  const hasRequiredPermission = !requiredPermission || hasPermission(requiredPermission);

  // If user doesn't have access, redirect to fallback
  if (!hasRequiredRole || !hasRequiredPermission) {
    console.warn(`Access denied: User role '${userRole}' does not have required access`);
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
