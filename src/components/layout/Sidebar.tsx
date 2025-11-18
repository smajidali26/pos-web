import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useRoleAccess from '../../hooks/useRoleAccess';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [inventoryExpanded, setInventoryExpanded] = useState(false);
  const [storesExpanded, setStoresExpanded] = useState(false);
  const [transfersExpanded, setTransfersExpanded] = useState(false);
  const [loyaltyExpanded, setLoyaltyExpanded] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const {
    canAccessDashboard,
    canAccessProducts,
    canAccessCategories,
    canAccessVendors,
    canAccessCustomers,
    canAccessOrders,
    canAccessSales,
    canAccessReports,
    hasPermission
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`main-sidebar sidebar-dark-primary elevation-4 ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <i className="bi bi-shop brand-icon"></i>
        <span className="brand-text font-weight-light">POSWeb</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
            {/* Dashboard */}
            {userCanAccessDashboard && (
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <i className="nav-icon bi bi-speedometer2"></i>
                  <p>Dashboard</p>
                </Link>
              </li>
            )}

            {/* Products Menu */}
            {(userCanAccessProducts || userCanAccessCategories || userCanAccessVendors) && (
              <li className={`nav-item ${productsExpanded ? 'menu-open' : ''}`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setProductsExpanded(!productsExpanded);
                  }}
                >
                  <i className="nav-icon bi bi-box"></i>
                  <p>
                    Products
                    <i className={`right bi bi-chevron-${productsExpanded ? 'down' : 'left'}`}></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {userCanAccessProducts && (
                    <li className="nav-item">
                      <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
                        <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                        <p>All Products</p>
                      </Link>
                    </li>
                  )}
                  {userCanAccessCategories && (
                    <li className="nav-item">
                      <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>
                        <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                        <p>Categories</p>
                      </Link>
                    </li>
                  )}
                  {userCanAccessCategories && (
                    <li className="nav-item">
                      <Link to="/sizes" className={`nav-link ${isActive('/sizes') ? 'active' : ''}`}>
                        <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                        <p>Sizes</p>
                      </Link>
                    </li>
                  )}
                  {userCanAccessVendors && (
                    <li className="nav-item">
                      <Link to="/vendors" className={`nav-link ${isActive('/vendors') ? 'active' : ''}`}>
                        <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                        <p>Vendors</p>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Customers */}
            {userCanAccessCustomers && (
              <li className="nav-item">
                <Link to="/customers" className={`nav-link ${isActive('/customers') ? 'active' : ''}`}>
                  <i className="nav-icon bi bi-people"></i>
                  <p>Customers</p>
                </Link>
              </li>
            )}

            {/* Orders */}
            {userCanAccessOrders && (
              <li className="nav-item">
                <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                  <i className="nav-icon bi bi-receipt"></i>
                  <p>Orders</p>
                </Link>
              </li>
            )}

            {/* Sales */}
            {userCanAccessSales && (
              <li className="nav-item">
                <Link to="/sales" className={`nav-link ${isActive('/sales') ? 'active' : ''}`}>
                  <i className="nav-icon bi bi-cart-check"></i>
                  <p>Sales</p>
                </Link>
              </li>
            )}

            {/* Reports */}
            {userCanAccessReports && (
              <li className="nav-item">
                <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
                  <i className="nav-icon bi bi-graph-up"></i>
                  <p>Reports</p>
                </Link>
              </li>
            )}

            {/* Inventory Management */}
            {userCanAccessReports && (
              <li className={`nav-item ${inventoryExpanded ? 'menu-open' : ''}`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setInventoryExpanded(!inventoryExpanded);
                  }}
                >
                  <i className="nav-icon bi bi-boxes"></i>
                  <p>
                    Inventory
                    <i className={`right bi bi-chevron-${inventoryExpanded ? 'down' : 'left'}`}></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/inventory/movements" className={`nav-link ${isActive('/inventory/movements') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Stock Movements</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory/locations" className={`nav-link ${isActive('/inventory/locations') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Locations</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory/transfers" className={`nav-link ${isActive('/inventory/transfers') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Stock Transfers</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory/batches" className={`nav-link ${isActive('/inventory/batches') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Batches</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory/serial-numbers" className={`nav-link ${isActive('/inventory/serial-numbers') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Serial Numbers</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory/alerts" className={`nav-link ${isActive('/inventory/alerts') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Stock Alerts</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Store Management */}
            {userCanAccessReports && (
              <li className={`nav-item ${storesExpanded ? 'menu-open' : ''}`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setStoresExpanded(!storesExpanded);
                  }}
                >
                  <i className="nav-icon bi bi-shop"></i>
                  <p>
                    Stores
                    <i className={`right bi bi-chevron-${storesExpanded ? 'down' : 'left'}`}></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/stores" className={`nav-link ${isActive('/stores') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>All Stores</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/stores/hierarchy" className={`nav-link ${isActive('/stores/hierarchy') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Store Hierarchy</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Inter-Store Transfers */}
            {userCanAccessReports && (
              <li className={`nav-item ${transfersExpanded ? 'menu-open' : ''}`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setTransfersExpanded(!transfersExpanded);
                  }}
                >
                  <i className="nav-icon bi bi-arrow-left-right"></i>
                  <p>
                    Transfers
                    <i className={`right bi bi-chevron-${transfersExpanded ? 'down' : 'left'}`}></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/transfers" className={`nav-link ${isActive('/transfers') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>All Transfers</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/transfers/pending" className={`nav-link ${isActive('/transfers/pending') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Pending Transfers</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Loyalty Program */}
            {userCanAccessReports && (
              <li className={`nav-item ${loyaltyExpanded ? 'menu-open' : ''}`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setLoyaltyExpanded(!loyaltyExpanded);
                  }}
                >
                  <i className="nav-icon bi bi-star"></i>
                  <p>
                    Loyalty Program
                    <i className={`right bi bi-chevron-${loyaltyExpanded ? 'down' : 'left'}`}></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/loyalty/dashboard" className={`nav-link ${isActive('/loyalty/dashboard') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Dashboard</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/loyalty/rewards" className={`nav-link ${isActive('/loyalty/rewards') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Rewards</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/loyalty/settings" className={`nav-link ${isActive('/loyalty/settings') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Settings</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Analytics */}
            {userCanAccessReports && (
              <li className={`nav-item ${analyticsExpanded ? 'menu-open' : ''}`}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setAnalyticsExpanded(!analyticsExpanded);
                  }}
                >
                  <i className="nav-icon bi bi-bar-chart-line"></i>
                  <p>
                    Analytics
                    <i className={`right bi bi-chevron-${analyticsExpanded ? 'down' : 'left'}`}></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/analytics/realtime" className={`nav-link ${isActive('/analytics/realtime') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Real-time Dashboard</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/analytics/sales" className={`nav-link ${isActive('/analytics/sales') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Sales Analytics</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/analytics/forecast" className={`nav-link ${isActive('/analytics/forecast') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Sales Forecast</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/analytics/abc-analysis" className={`nav-link ${isActive('/analytics/abc-analysis') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>ABC Analysis</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/analytics/turnover" className={`nav-link ${isActive('/analytics/turnover') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Inventory Turnover</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/analytics/inventory" className={`nav-link ${isActive('/analytics/inventory') ? 'active' : ''}`}>
                      <i className="bi bi-circle nav-icon" style={{ fontSize: '0.5rem' }}></i>
                      <p>Inventory Health</p>
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* User Management */}
            {userCanManageUsers && (
              <li className="nav-item">
                <Link to="/users" className={`nav-link ${isActive('/users') ? 'active' : ''}`}>
                  <i className="nav-icon bi bi-person-gear"></i>
                  <p>Users</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
