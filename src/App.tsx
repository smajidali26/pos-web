import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ProtectedRoute, RoleProtectedRoute, Unauthorized, RoleBasedRedirect } from './components/auth';
import Layout from './components/layout';
import { RouteChangeHandler } from './components/ui';
import Dashboard from './components/dashboard';
import Products from './components/products';
import Categories from './components/categories';
import { Sizes } from './components/sizes';
import { Vendors } from './components/vendors';
import Sales from './components/sales';
import Reports from './components/reports';
import Customers from './components/customers/Customers';
import Orders from './components/orders/Orders';
import Login from './components/login/Login';
import { UserManagementPage } from './components/users/UserManagementPage';
import InventoryMovements from './components/inventory/InventoryMovements';
import Locations from './components/inventory/Locations';
import StockTransfers from './components/inventory/StockTransfers';
import Batches from './components/inventory/Batches';
import StockAlerts from './components/inventory/StockAlerts';
import useTokenRefresh from './hooks/useTokenRefresh';
import { USER_ROLES, type UserRole } from './hooks/useRoleAccess';
import { validateSessionRequest } from './store/auth';
import type { AppDispatch, RootState } from './store';
import './App.css';
import './styles/adminlte.css';

function App(): React.ReactElement {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [sessionChecked, setSessionChecked] = React.useState(false);

  // Validate session ONCE on app startup (check for existing cookie)
  // Only validate if NOT already authenticated and user didn't explicitly logout
  useEffect(() => {
    if (!sessionChecked) {
      // Skip validation if already authenticated (from successful login)
      if (isAuthenticated) {
        console.log('🚀 App mounted - already authenticated, skipping validation');
        setSessionChecked(true);
        return;
      }

      // Skip validation if user explicitly logged out or we already know there's no cookie
      const explicitLogout = sessionStorage.getItem('explicitLogout');
      const noSessionCookie = sessionStorage.getItem('noSessionCookie');

      if (explicitLogout === 'true' || noSessionCookie === 'true') {
        console.log('🚀 App mounted - skipping validation (no cookie expected)');
        sessionStorage.removeItem('explicitLogout');
        setSessionChecked(true);
        return;
      }

      // Only validate if we might have a cookie (not authenticated yet, no flags set)
      console.log('🚀 App mounted - validating session from cookie');
      dispatch(validateSessionRequest());
      setSessionChecked(true);
    }
  }, [dispatch, sessionChecked, isAuthenticated]);

  // Initialize token refresh functionality
  useTokenRefresh();

  return (
    <Routes>
      {/* Login route - Public, no layout */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes - Require authentication */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <RouteChangeHandler>
                <Routes>
                  {/* Root route - Redirect to role-specific default page */}
                  <Route
                    path="/"
                    element={<RoleBasedRedirect />}
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

            {/* Categories routes - Owner and Manager */}
            <Route
              path="/categories"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Categories key={`categories-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

            {/* Sizes routes - Owner and Manager */}
            <Route
              path="/sizes"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Sizes key={`sizes-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

            {/* Vendors routes - Owner and Manager */}
            <Route
              path="/vendors"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Vendors key={`vendors-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

            {/* Customers routes - Owner and Manager */}
            <Route
              path="/customers"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Customers key={`customers-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

            {/* Orders routes - Owner, Manager, and Cashier */}
            <Route
              path="/orders"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CASHIER]}>
                  <Orders key={`orders-${location.pathname}`} />
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

            {/* Reports routes - Owner and Manager */}
            <Route
              path="/reports"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Reports key={`reports-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

            {/* User Management - Owner only */}
            <Route
              path="/users"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER]}>
                  <UserManagementPage key={`users-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

            {/* Inventory Management routes - Owner and Manager */}
            <Route
              path="/inventory/movements"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <InventoryMovements key={`inventory-movements-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/inventory/locations"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Locations key={`locations-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/inventory/transfers"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <StockTransfers key={`transfers-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/inventory/batches"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <Batches key={`batches-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/inventory/alerts"
              element={
                <RoleProtectedRoute requiredRoles={[USER_ROLES.OWNER, USER_ROLES.MANAGER]}>
                  <StockAlerts key={`alerts-${location.pathname}`} />
                </RoleProtectedRoute>
              }
            />

                  {/* Unauthorized page */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
              </RouteChangeHandler>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
