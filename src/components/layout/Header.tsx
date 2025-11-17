import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../store/auth/actions';
import { clearCart } from '../../store/cart';
import useRoleAccess from '../../hooks/useRoleAccess';
import { ChangePasswordModal } from '../profile/ChangePasswordModal';
import type { RootState, AppDispatch } from '../../store';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
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
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            className="nav-link btn btn-link"
            onClick={onToggleSidebar}
            style={{ border: 'none', background: 'none' }}
          >
            <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
          </button>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ms-auto">
        {/* User Menu */}
        <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle btn btn-link text-dark text-decoration-none border-0 d-flex align-items-center"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-2" style={{ fontSize: '1.5rem' }}></i>
            <div className="d-flex flex-column align-items-start">
              <span className="fw-semibold">{user?.username || 'User'}</span>
              <small className="text-muted">{roleDisplayName}</small>
            </div>
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
        </li>
      </ul>

      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </nav>
  );
};

export default Header;
