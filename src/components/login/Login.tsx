import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../../store/auth';
import { AppDispatch, RootState } from '../../store';
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
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

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
