import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="float-end d-none d-sm-inline">
        <b>Version</b> 1.0.0
      </div>
      <strong>&copy; {currentYear} POSWeb.</strong> All rights reserved.
    </footer>
  );
};

export default Footer;
