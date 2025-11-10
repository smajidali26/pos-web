import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../store/auth';
import { AppDispatch, RootState } from '../../store';
import { USER_ROLES } from '../../hooks/useRoleAccess';
import LoginHeader from './LoginHeader';
import LoginError from './LoginError';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const hasRedirected = useRef(false);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('📋 LOGIN COMPONENT - Auth state:', { isLoading, isAuthenticated, error });
  }, [isLoading, isAuthenticated, error]);

  // Redirect to role-specific default page after successful login
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      const userRole = user.roleName?.toLowerCase();

      // Define default pages for each role
      let defaultPage = '/dashboard'; // Default fallback

      if (userRole === USER_ROLES.CASHIER) {
        defaultPage = '/orders';
        console.log('Login: Cashier authenticated, redirecting to orders');
      } else if (userRole === USER_ROLES.OWNER || userRole === USER_ROLES.MANAGER) {
        defaultPage = '/dashboard';
        console.log(`Login: ${user.roleName} authenticated, redirecting to dashboard`);
      } else if (userRole === USER_ROLES.EMPLOYEE) {
        defaultPage = '/sales';
        console.log('Login: Employee authenticated, redirecting to sales');
      }

      hasRedirected.current = true;
      // Use replace to avoid keeping login page in history
      navigate(defaultPage, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Reset redirect flag when component unmounts (logout)
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  const handleSubmit = (formData: LoginFormData) => {
    dispatch(loginRequest(formData));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <LoginHeader />
                <LoginError error={error} />
                <LoginForm 
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error}
                />
                <LoginFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
