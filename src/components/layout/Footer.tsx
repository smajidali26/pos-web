import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light border-top py-3 mt-auto">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6">
            <small className="text-muted">
              © {currentYear} POSWeb. Built with React & Redux.
            </small>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Version 1.0.0 | 
              <a href="#" className="text-decoration-none ms-1">Help</a> | 
              <a href="#" className="text-decoration-none ms-1">Support</a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
