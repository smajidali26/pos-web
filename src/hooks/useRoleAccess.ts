import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// Define user roles
export const USER_ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  EMPLOYEE: 'employee'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Define role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [USER_ROLES.OWNER]: 4,
  [USER_ROLES.MANAGER]: 3,
  [USER_ROLES.CASHIER]: 2,
  [USER_ROLES.EMPLOYEE]: 1
};

// Define permissions for different features
export const PERMISSIONS = {
  // Dashboard access
  VIEW_DASHBOARD: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  
  // Categories management
  VIEW_CATEGORIES: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  CREATE_CATEGORIES: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  UPDATE_CATEGORIES: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  DELETE_CATEGORIES: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  
  // Products management
  VIEW_PRODUCTS: [USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CASHIER],
  CREATE_PRODUCTS: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  UPDATE_PRODUCTS: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  DELETE_PRODUCTS: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  
  // Sales
  VIEW_SALES: [USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CASHIER],
  CREATE_SALES: [USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CASHIER],
  
  // Reports
  VIEW_REPORTS: [USER_ROLES.OWNER, USER_ROLES.MANAGER],
  
  // User management
  MANAGE_USERS: [USER_ROLES.OWNER],
  
  // System settings
  MANAGE_SETTINGS: [USER_ROLES.OWNER, USER_ROLES.MANAGER]
} as const;

export type Permission = keyof typeof PERMISSIONS;
export type PermissionList = readonly UserRole[];

interface User {
  id?: string | number;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  roleName?: string;
  userRole?: string;
  Role?: string;
  isActive?: boolean;
  lastLoginDate?: string;
  createdAt?: string;
}

export const useRoleAccess = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Get user role (with fallback to lowest role)
  const getUserRole = (): UserRole | null => {
    if (!user || !isAuthenticated) {
      console.log('useRoleAccess: No user or not authenticated', { user, isAuthenticated });
      return null;    
    }
    
    // Debug: Log the user object structure
    console.log('useRoleAccess: User object:', user);
    
    // Try different possible role field names and normalize to lowercase
    let role: string | null = null;
    
    if (user.roleName) {
      role = user.roleName.toLowerCase();
    } else if (user.role && typeof user.role === 'string') {
      role = (user.role as string).toLowerCase();
    } else if ((user as any).userRole) {
      role = (user as any).userRole.toLowerCase();
    } else if ((user as any).Role) {
      role = (user as any).Role.toLowerCase();
    } else {
      // Default to employee if no role found
      role = USER_ROLES.EMPLOYEE;
    }
    
    console.log('useRoleAccess: Detected role:', role);
    return role as UserRole;
  };

  // Check if user has specific permission
  const hasPermission = (permission: Permission): boolean => {
    const userRole = getUserRole();
    if (!userRole) {
      console.log(`useRoleAccess: No user role for permission check: ${permission}`);
      return false;
    }
    
    const allowedRoles = PERMISSIONS[permission] as readonly UserRole[];
    const hasAccess = allowedRoles ? allowedRoles.includes(userRole) : false;
    console.log(`useRoleAccess: Permission '${permission}': userRole='${userRole}', hasAccess=${hasAccess}`);
    return hasAccess;
  };

  // Check if user has any of the specified roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    const userRole = getUserRole();
    if (!userRole) {
      console.log('useRoleAccess: No user role for role check', { roles });
      return false;
    }
    
    let hasAccess = false;
    if (Array.isArray(roles)) {
      hasAccess = roles.includes(userRole);
    } else {
      hasAccess = userRole === roles;
    }
    
    console.log(`useRoleAccess: Role check: userRole='${userRole}', requiredRoles=`, roles, 'hasAccess=', hasAccess);
    return hasAccess;
  };

  // Check if user role is at least the specified level
  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    const userRole = getUserRole();
    if (!userRole) return false;
    
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const minimumLevel = ROLE_HIERARCHY[minimumRole] || 0;
    
    return userLevel >= minimumLevel;
  };

  // Get user role display name
  const getRoleDisplayName = (): string => {
    const role = getUserRole();
    if (!role) return 'Unknown';
    
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Check if user can access dashboard
  const canAccessDashboard = (): boolean => hasPermission('VIEW_DASHBOARD');

  // Check if user can access categories
  const canAccessCategories = (): boolean => hasPermission('VIEW_CATEGORIES');

  // Check if user can manage categories
  const canManageCategories = (): boolean => 
    hasPermission('CREATE_CATEGORIES') && 
    hasPermission('UPDATE_CATEGORIES') && 
    hasPermission('DELETE_CATEGORIES');

  // Check if user can access products
  const canAccessProducts = (): boolean => hasPermission('VIEW_PRODUCTS');

  // Check if user can manage products
  const canManageProducts = (): boolean => 
    hasPermission('CREATE_PRODUCTS') && 
    hasPermission('UPDATE_PRODUCTS') && 
    hasPermission('DELETE_PRODUCTS');

  // Check if user can access sales
  const canAccessSales = (): boolean => hasPermission('VIEW_SALES');

  // Check if user can access reports
  const canAccessReports = (): boolean => hasPermission('VIEW_REPORTS');

  return {
    userRole: getUserRole(),
    roleDisplayName: getRoleDisplayName(),
    hasPermission,
    hasRole,
    hasMinimumRole,
    canAccessDashboard,
    canAccessCategories,
    canManageCategories,
    canAccessProducts,
    canManageProducts,
    canAccessSales,
    canAccessReports,
    // Export constants for use in components
    USER_ROLES,
    PERMISSIONS
  };
};

export default useRoleAccess;
