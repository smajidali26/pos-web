import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { USER_ROLES } from '../../hooks/useRoleAccess';

/**
 * Component that redirects users to their role-specific default page
 * - Owner/Manager → /dashboard
 * - Cashier → /orders
 * - Employee → /sales
 */
const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      const userRole = user.roleName?.toLowerCase();

      // Define default pages for each role
      let defaultPage = '/dashboard'; // Default fallback

      if (userRole === USER_ROLES.CASHIER) {
        defaultPage = '/orders';
      } else if (userRole === USER_ROLES.OWNER || userRole === USER_ROLES.MANAGER) {
        defaultPage = '/dashboard';
      } else if (userRole === USER_ROLES.EMPLOYEE) {
        defaultPage = '/sales';
      }

      console.log(`RoleBasedRedirect: Redirecting ${user.roleName} to ${defaultPage}`);
      navigate(defaultPage, { replace: true });
    }
  }, [user, navigate]);

  // Show nothing while redirecting
  return null;
};

export default RoleBasedRedirect;
