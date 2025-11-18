import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { useAnalytics } from '../../hooks/useAnalytics';
import { HourlySalesChart, TopProductsBarChart, PaymentMethodPieChart } from './charts';
import ANALYTICS_CONFIG from '../../config/analyticsConfig';

const RealTimeDashboard: React.FC = () => {
  const {
    dashboard,
    dashboardLoading,
    dashboardError,
    fetchDashboard,
  } = useAnalytics();

  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboard();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboard();
      setLastRefresh(new Date());
    }, ANALYTICS_CONFIG.REFRESH_INTERVALS.REALTIME_DASHBOARD);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'increase') return <i className="bi bi-arrow-up text-success"></i>;
    if (changeType === 'decrease') return <i className="bi bi-arrow-down text-danger"></i>;
    return <i className="bi bi-dash text-muted"></i>;
  };

  const getChangeClass = (changeType: string) => {
    if (changeType === 'increase') return 'text-success';
    if (changeType === 'decrease') return 'text-danger';
    return 'text-muted';
  };

  if (dashboardLoading && !dashboard) {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1>Real-Time Dashboard</h1>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1>Real-Time Dashboard</h1>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle"></i> {dashboardError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h1>Real-Time Dashboard</h1>
            <div className="text-muted small">
              <i className="bi bi-clock"></i> Last updated: {lastRefresh.toLocaleTimeString()}
              {dashboardLoading && <span className="spinner-border spinner-border-sm ms-2"></span>}
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {/* KPI Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6}>
              <Card className="bg-info text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-1">Today's Sales</h6>
                      <h3 className="mb-0">${dashboard.todaySales.value.toLocaleString()}</h3>
                      <small className={getChangeClass(dashboard.todaySales.changeType)}>
                        {getChangeIcon(dashboard.todaySales.changeType)}
                        {Math.abs(dashboard.todaySales.change).toFixed(1)}% {dashboard.todaySales.comparisonLabel}
                      </small>
                    </div>
                    <i className="bi bi-currency-dollar" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="bg-success text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-1">Today's Orders</h6>
                      <h3 className="mb-0">{dashboard.todayOrders.value}</h3>
                      <small className={getChangeClass(dashboard.todayOrders.changeType)}>
                        {getChangeIcon(dashboard.todayOrders.changeType)}
                        {Math.abs(dashboard.todayOrders.change).toFixed(1)}% {dashboard.todayOrders.comparisonLabel}
                      </small>
                    </div>
                    <i className="bi bi-cart" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="bg-warning text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-1">Customers</h6>
                      <h3 className="mb-0">{dashboard.todayCustomers.value}</h3>
                      <small className={getChangeClass(dashboard.todayCustomers.changeType)}>
                        {getChangeIcon(dashboard.todayCustomers.changeType)}
                        {Math.abs(dashboard.todayCustomers.change).toFixed(1)}% {dashboard.todayCustomers.comparisonLabel}
                      </small>
                    </div>
                    <i className="bi bi-people" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3} md={6}>
              <Card className="bg-danger text-white">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-1">Avg Order Value</h6>
                      <h3 className="mb-0">${dashboard.avgOrderValue.value.toFixed(2)}</h3>
                      <small className={getChangeClass(dashboard.avgOrderValue.changeType)}>
                        {getChangeIcon(dashboard.avgOrderValue.changeType)}
                        {Math.abs(dashboard.avgOrderValue.change).toFixed(1)}% {dashboard.avgOrderValue.comparisonLabel}
                      </small>
                    </div>
                    <i className="bi bi-graph-up" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <Card.Title>Hourly Sales</Card.Title>
                </Card.Header>
                <Card.Body>
                  <HourlySalesChart data={dashboard.hourlySales} height={300} />
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card>
                <Card.Header>
                  <Card.Title>Payment Methods</Card.Title>
                </Card.Header>
                <Card.Body>
                  <PaymentMethodPieChart paymentMethods={dashboard.paymentMethods} height={300} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Top Products and Categories */}
          <Row className="mb-4">
            <Col lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Top 10 Products</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table striped hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.topProducts.map((product, index) => (
                          <tr key={product.productId}>
                            <td>{index + 1}</td>
                            <td>{product.productName}</td>
                            <td className="text-end">{product.quantity}</td>
                            <td className="text-end">${product.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <Card.Header>
                  <Card.Title>Top Categories</Card.Title>
                </Card.Header>
                <Card.Body>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table striped hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Category</th>
                          <th className="text-end">Revenue</th>
                          <th className="text-end">Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.topCategories.map((category, index) => (
                          <tr key={category.categoryId}>
                            <td>{index + 1}</td>
                            <td>{category.categoryName}</td>
                            <td className="text-end">${category.revenue.toLocaleString()}</td>
                            <td className="text-end">
                              <Badge bg="primary">{category.percentage.toFixed(1)}%</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Inventory Status */}
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <Card.Title>Inventory Status</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <div className="text-center p-3">
                        <h4>{dashboard.inventoryStatus.totalProducts}</h4>
                        <p className="text-muted mb-0">Total Products</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3">
                        <h4 className="text-warning">{dashboard.inventoryStatus.lowStockItems}</h4>
                        <p className="text-muted mb-0">Low Stock</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3">
                        <h4 className="text-danger">{dashboard.inventoryStatus.outOfStockItems}</h4>
                        <p className="text-muted mb-0">Out of Stock</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center p-3">
                        <h4 className="text-info">{dashboard.inventoryStatus.overstockedItems}</h4>
                        <p className="text-muted mb-0">Overstocked</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
