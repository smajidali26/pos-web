import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteChangeHandlerProps {
  children: React.ReactNode;
}

const RouteChangeHandler: React.FC<RouteChangeHandlerProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Force a small delay to ensure proper re-rendering
    const timer = setTimeout(() => {
      console.log('Route changed, forcing update:', location.pathname);
      // Scroll to top on route change
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
};

export default RouteChangeHandler;
