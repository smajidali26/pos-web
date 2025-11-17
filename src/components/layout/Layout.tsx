import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`wrapper ${sidebarCollapsed ? 'sidebar-collapse' : ''}`}>
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            {/* Content header can be added here if needed */}
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            {children}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
