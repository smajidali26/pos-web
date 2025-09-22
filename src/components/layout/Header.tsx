import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutRequest } from '../../store/auth/actions';
import { clearCart } from '../../store/cart';
import useRoleAccess from '../../hooks/useRoleAccess';
import type { RootState, AppDispatch } from '../../store';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    canAccessDashboard, 
    canAccessProducts, 
    canAccessCategories, 
    canAccessSales, 
    canAccessReports,
    roleDisplayName 
  } = useRoleAccess();

  // Get permission check results
  const userCanAccessDashboard = canAccessDashboard();
  const userCanAccessProducts = canAccessProducts();
  const userCanAccessCategories = canAccessCategories();
  const userCanAccessSales = canAccessSales();
  const userCanAccessReports = canAccessReports();

  const handleLogout = () => {
    dispatch(logoutRequest());
    dispatch(clearCart());
    navigate('/login');
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

            {/* Products - Owner and Manager only */}
            {userCanAccessProducts && (
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  <i className="bi bi-box me-1"></i>
                  Products
                </Link>
              </li>
            )}

            {/* Categories - Owner and Manager only */}
            {userCanAccessCategories && (
              <li className="nav-item">
                <Link className="nav-link" to="/categories">
                  <i className="bi bi-tags me-1"></i>
                  Categories
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
                  <button className="dropdown-item" disabled>
                    <i className="bi bi-person me-2"></i>
                    Profile (Coming Soon)
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" disabled>
                    <i className="bi bi-gear me-2"></i>
                    Settings (Coming Soon)
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
    </nav>
  );
};

export default Header;
