import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useAnalytics } from '../../hooks/useAnalytics';
import { SalesLineChart, TopProductsBarChart } from './charts';
import { GroupBy } from '../../types/analytics';
import ANALYTICS_CONFIG from '../../config/analyticsConfig';
import { format } from 'date-fns';

const SalesAnalytics: React.FC = () => {
  const {
    salesAnalytics,
    salesAnalyticsLoading,
    salesAnalyticsError,
    fetchSalesAnalytics,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState(() => ANALYTICS_CONFIG.DATE_RANGES.LAST_30_DAYS());
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.DAY);
  const [storeId, setStoreId] = useState<string>('');

  useEffect(() => {
    fetchSalesAnalytics({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      storeId: storeId || undefined,
      groupBy,
    });
  }, [dateRange, groupBy, storeId, fetchSalesAnalytics]);

  const handleDateRangeChange = (range: string) => {
    const rangeFunc = ANALYTICS_CONFIG.DATE_RANGES[range as keyof typeof ANALYTICS_CONFIG.DATE_RANGES];
    if (typeof rangeFunc === 'function') {
      setDateRange(rangeFunc());
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Sales Analytics</h1>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date Range</Form.Label>
                    <Form.Select onChange={(e) => handleDateRangeChange(e.target.value)}>
                      <option value="LAST_7_DAYS">Last 7 Days</option>
                      <option value="LAST_30_DAYS" selected>Last 30 Days</option>
                      <option value="LAST_90_DAYS">Last 90 Days</option>
                      <option value="THIS_MONTH">This Month</option>
                      <option value="LAST_MONTH">Last Month</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Group By</Form.Label>
                    <Form.Select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)}>
                      <option value={GroupBy.DAY}>Day</option>
                      <option value={GroupBy.WEEK}>Week</option>
                      <option value={GroupBy.MONTH}>Month</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={format(new Date(dateRange.startDate), 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={format(new Date(dateRange.endDate), 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {salesAnalyticsLoading && !salesAnalytics ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : salesAnalyticsError ? (
            <div className="alert alert-danger">{salesAnalyticsError}</div>
          ) : salesAnalytics ? (
            <>
              {/* KPI Summary */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="bg-primary text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Total Sales</h6>
                      <h3>${salesAnalytics.summary.totalSales.toLocaleString()}</h3>
                      <small>
                        {salesAnalytics.summary.salesGrowth > 0 ? '+' : ''}
                        {salesAnalytics.summary.salesGrowth.toFixed(1)}% vs previous
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-success text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Total Orders</h6>
                      <h3>{salesAnalytics.summary.totalOrders.toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-info text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Customers</h6>
                      <h3>{salesAnalytics.summary.totalCustomers.toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-warning text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Avg Order Value</h6>
                      <h3>${salesAnalytics.summary.avgOrderValue.toFixed(2)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Sales Trend */}
              <Card className="mb-4">
                <Card.Header>
                  <Card.Title>Sales Trend</Card.Title>
                </Card.Header>
                <Card.Body>
                  <SalesLineChart data={salesAnalytics.salesData} height={400} />
                </Card.Body>
              </Card>

              {/* Top Products and Categories */}
              <Row>
                <Col lg={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Top Products</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <TopProductsBarChart products={salesAnalytics.topProducts} height={400} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card>
                    <Card.Header>
                      <Card.Title>Top Categories</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th className="text-end">Revenue</th>
                            <th className="text-end">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesAnalytics.topCategories.map(cat => (
                            <tr key={cat.categoryId}>
                              <td>{cat.categoryName}</td>
                              <td className="text-end">${cat.revenue.toLocaleString()}</td>
                              <td className="text-end">{cat.percentage.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
