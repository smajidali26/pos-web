import React from 'react';

interface LoginFooterProps {
  contactText?: string;
  contactLink?: string;
  showDemoCredentials?: boolean;
}

const LoginFooter: React.FC<LoginFooterProps> = ({ 
  contactText = "Don't have an account?", 
  contactLink = "Contact Administrator",
  showDemoCredentials = true 
}) => {
  return (
    <>
      {/* Footer */}
      <div className="text-center mt-4">
        <small className="text-muted">
          {contactText} <a href="#" className="text-decoration-none">{contactLink}</a>
        </small>
      </div>

      {/* Demo Credentials */}
      {showDemoCredentials && (
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Demo Credentials:</strong><br />
            Username: admin<br />
            Password: password
          </small>
        </div>
      )}
    </>
  );
};

export default LoginFooter;
