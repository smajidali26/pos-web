import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AnalyticsDashboard: React.FC = () => {
  const analyticsModules = [
    {
      title: 'Real-Time Dashboard',
      description: 'Live sales metrics, hourly trends, and instant insights',
      icon: 'bi-speedometer2',
      color: 'primary',
      link: '/analytics/realtime',
    },
    {
      title: 'Sales Analytics',
      description: 'Comprehensive sales reporting and trend analysis',
      icon: 'bi-graph-up',
      color: 'success',
      link: '/analytics/sales',
    },
    {
      title: 'Sales Forecast',
      description: 'Predictive analytics and demand forecasting',
      icon: 'bi-graph-up-arrow',
      color: 'info',
      link: '/analytics/forecast',
    },
    {
      title: 'ABC Analysis',
      description: 'Product classification by revenue contribution',
      icon: 'bi-bar-chart-steps',
      color: 'warning',
      link: '/analytics/abc-analysis',
    },
    {
      title: 'Inventory Turnover',
      description: 'Stock movement analysis and turnover metrics',
      icon: 'bi-arrow-repeat',
      color: 'danger',
      link: '/analytics/turnover',
    },
    {
      title: 'Inventory Health',
      description: 'Stock health monitoring and recommendations',
      icon: 'bi-heart-pulse',
      color: 'purple',
      link: '/analytics/inventory',
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Analytics Hub</h1>
          <p className="text-muted">Comprehensive analytics and insights for your business</p>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          <Row>
            {analyticsModules.map((module, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Link to={module.link} className="text-decoration-none">
                  <Card className={`h-100 border-${module.color} hover-shadow`}>
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        <div className={`text-${module.color} me-3`}>
                          <i className={`${module.icon}`} style={{ fontSize: '3rem' }}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title">{module.title}</h5>
                          <p className="text-muted mb-0">{module.description}</p>
                        </div>
                        <div>
                          <i className="bi bi-arrow-right text-muted"></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Quick Info */}
          <Row className="mt-4">
            <Col lg={12}>
              <Card className="bg-light">
                <Card.Body>
                  <h5>Getting Started with Analytics</h5>
                  <Row className="mt-3">
                    <Col md={4}>
                      <h6><i className="bi bi-lightbulb text-warning"></i> Real-Time Insights</h6>
                      <p className="small text-muted">Monitor your business performance in real-time with auto-refreshing dashboards.</p>
                    </Col>
                    <Col md={4}>
                      <h6><i className="bi bi-graph-up text-success"></i> Predictive Analytics</h6>
                      <p className="small text-muted">Forecast future sales trends using advanced statistical models.</p>
                    </Col>
                    <Col md={4}>
                      <h6><i className="bi bi-boxes text-info"></i> Inventory Optimization</h6>
                      <p className="small text-muted">Optimize stock levels with ABC analysis and turnover metrics.</p>
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

export default AnalyticsDashboard;
