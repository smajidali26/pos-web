import React from 'react';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ 
  title = "POSWeb", 
  subtitle = "Sign in to your account" 
}) => {
  return (
    <div className="text-center mb-4">
      <i className="bi bi-shop text-primary" style={{ fontSize: '3rem' }}></i>
      <h3 className="mt-2 mb-1">{title}</h3>
      <p className="text-muted">{subtitle}</p>
    </div>
  );
};

export default LoginHeader;
