import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../store/auth/actions';
import { clearCart } from '../../store/cart';
import useRoleAccess from '../../hooks/useRoleAccess';
import { ChangePasswordModal } from '../profile/ChangePasswordModal';
import type { RootState, AppDispatch } from '../../store';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const {
    canAccessDashboard,
    canAccessProducts,
    canAccessCategories,
    canAccessVendors,
    canAccessCustomers,
    canAccessOrders,
    canAccessSales,
    canAccessReports,
    hasPermission,
    roleDisplayName
  } = useRoleAccess();

  // Get permission check results
  const userCanAccessDashboard = canAccessDashboard();
  const userCanAccessProducts = canAccessProducts();
  const userCanAccessCategories = canAccessCategories();
  const userCanAccessVendors = canAccessVendors();
  const userCanAccessCustomers = canAccessCustomers();
  const userCanAccessOrders = canAccessOrders();
  const userCanAccessSales = canAccessSales();
  const userCanAccessReports = canAccessReports();
  const userCanManageUsers = hasPermission('MANAGE_USERS');

  const handleLogout = () => {
    console.log('Header - Logout button clicked');
    console.log('Header - Dispatching logoutRequest');
    dispatch(logoutRequest());
    dispatch(clearCart());

    // Don't navigate manually - let ProtectedRoute redirect when isAuthenticated becomes false
    // This ensures the saga completes and isLoading is set to false
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-shop me-2"></i>
          POSWeb
        </Link>

        {/* Mobile toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Dashboard - Owner and Manager only */}
            {userCanAccessDashboard && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Link>
              </li>
            )}

            {/* Products Menu - Owner and Manager only */}
            {(userCanAccessProducts || userCanAccessCategories || userCanAccessVendors) && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-box me-1"></i>
                  Products
                </a>
                <ul className="dropdown-menu">
                  {userCanAccessProducts && (
                    <li>
                      <Link className="dropdown-item" to="/products">
                        <i className="bi bi-box me-2"></i>
                        All Products
                      </Link>
                    </li>
                  )}
                  {userCanAccessCategories && (
                    <li>
                      <Link className="dropdown-item" to="/categories">
                        <i className="bi bi-tags me-2"></i>
                        Categories
                      </Link>
                    </li>
                  )}
                  {userCanAccessCategories && (
                    <li>
                      <Link className="dropdown-item" to="/sizes">
                        <i className="bi bi-rulers me-2"></i>
                        Sizes
                      </Link>
                    </li>
                  )}
                  {userCanAccessVendors && (
                    <li>
                      <Link className="dropdown-item" to="/vendors">
                        <i className="bi bi-building me-2"></i>
                        Vendors
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Customers - Owner and Manager only */}
            {userCanAccessCustomers && (
              <li className="nav-item">
                <Link className="nav-link" to="/customers">
                  <i className="bi bi-people me-1"></i>
                  Customers
                </Link>
              </li>
            )}

            {/* Orders - Owner, Manager, and Cashier */}
            {userCanAccessOrders && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  <i className="bi bi-receipt me-1"></i>
                  Orders
                </Link>
              </li>
            )}

            {/* Sales - All authenticated users */}
            {userCanAccessSales && (
              <li className="nav-item">
                <Link className="nav-link" to="/sales">
                  <i className="bi bi-cart-check me-1"></i>
                  Sales
                </Link>
              </li>
            )}

            {/* Reports - Owner and Manager only */}
            {userCanAccessReports && (
              <li className="nav-item">
                <Link className="nav-link" to="/reports">
                  <i className="bi bi-graph-up me-1"></i>
                  Reports
                </Link>
              </li>
            )}

            {/* User Management - Owner only */}
            {userCanManageUsers && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  <i className="bi bi-person-gear me-1"></i>
                  Users
                </Link>
              </li>
            )}
          </ul>

          {/* User Menu */}
          <div className="navbar-nav">
            <div className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link text-white text-decoration-none border-0" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user?.username || 'User'}
                <span className="badge bg-light text-primary ms-2 small">
                  {roleDisplayName}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <div className="dropdown-header">
                    <div className="fw-bold">{user?.username || 'User'}</div>
                    <small className="text-muted">Role: {roleDisplayName}</small>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    Change Password
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </nav>
  );
};

export default Header;
