import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute, RoleProtectedRoute, Unauthorized } from './components/auth';
import Layout from './components/layout';
import { RouteChangeHandler } from './components/ui';
import Dashboard from './components/dashboard';
import Products from './components/products';
import Categories from './components/categories';
import Sales from './components/sales';
import Reports from './components/reports';
import useTokenRefresh from './hooks/useTokenRefresh';
import { USER_ROLES, type UserRole } from './hooks/useRoleAccess';
import './App.css';

function App(): React.ReactElement {
  const location = useLocation();
  
  // Initialize token refresh functionality
  useTokenRefresh();

  return (
    <ProtectedRoute>
      <Layout>
        <RouteChangeHandler>
          <Routes>
            {/* Dashboard routes - Owner and Manager only */}
            <Route 
              path="/" 
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Dashboard key={`dashboard-${location.pathname}`} />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Dashboard key={`dashboard-${location.pathname}`} />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Products routes - Owner, Manager */}
            <Route 
              path="/products" 
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Products key={`products-${location.pathname}`} />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Categories routes - Owner and Manager only */}
            <Route 
              path="/categories" 
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Categories key={`categories-${location.pathname}`} />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Sales routes - Owner, Manager, and Cashier */}
            <Route 
              path="/sales" 
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CASHIER]}>
                  <Sales key={`sales-${location.pathname}`} />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Reports routes - Owner and Manager only */}
            <Route 
              path="/reports" 
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Reports key={`reports-${location.pathname}`} />
                </RoleProtectedRoute>
              } 
            />
            
            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </RouteChangeHandler>
      </Layout>
    </ProtectedRoute>
  );
}

export default App;
