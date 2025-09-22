import React from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '../../store/auth';
import { AppDispatch } from '../../store';

interface LoginErrorProps {
  error: string | null;
}

const LoginError: React.FC<LoginErrorProps> = ({ error }) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!error) return null;

  return (
    <div className="alert alert-danger alert-dismissible" role="alert">
      <i className="bi bi-exclamation-triangle me-2"></i>
      {error}
      <button 
        type="button" 
        className="btn-close" 
        onClick={() => dispatch(clearError())}
        aria-label="Close"
      ></button>
    </div>
  );
};

export default LoginError;
