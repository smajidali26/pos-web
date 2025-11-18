/**
 * Loyalty Dashboard Component - Main Analytics Dashboard
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useLoyalty } from '../../hooks/useLoyalty';
import { format } from 'date-fns';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const LoyaltyDashboard: React.FC = () => {
  const { dashboard, loading, error, fetchDashboard } = useLoyalty();
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchDashboard(dateRange.from, dateRange.to);
  }, [fetchDashboard, dateRange]);

  if (loading.dashboard) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error.dashboard) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error.dashboard}</Alert>
      </Container>
    );
  }

  if (!dashboard) {
    return (
      <Container className="py-4">
        <Alert variant="info">No dashboard data available</Alert>
      </Container>
    );
  }

  // Tier Distribution Chart Data
  const tierChartData = {
    labels: dashboard.tierDistribution.map(t => t.tierName),
    datasets: [
      {
        data: dashboard.tierDistribution.map(t => t.memberCount),
        backgroundColor: dashboard.tierDistribution.map(t => t.tierColor),
        borderWidth: 1
      }
    ]
  };

  // Monthly Activity Chart Data
  const monthlyActivityData = {
    labels: dashboard.monthlyActivity.map(m => m.month),
    datasets: [
      {
        label: 'Points Earned',
        data: dashboard.monthlyActivity.map(m => m.pointsEarned),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Points Redeemed',
        data: dashboard.monthlyActivity.map(m => m.pointsRedeemed),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Loyalty Program Dashboard</h2>

      {/* KPI Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h6 className="text-muted">Active Members</h6>
              <h2 className="mb-0">{dashboard.activeMembers.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h6 className="text-muted">Total Points Issued</h6>
              <h2 className="mb-0">{dashboard.totalPointsIssued.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h6 className="text-muted">Points Redeemed</h6>
              <h2 className="mb-0">{dashboard.totalPointsRedeemed.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h6 className="text-muted">Redemption Rate</h6>
              <h2 className="mb-0">{dashboard.redemptionRate.toFixed(1)}%</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Tier Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Pie data={tierChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Monthly Activity</h5>
            </Card.Header>
            <Card.Body>
              <Bar
                data={monthlyActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Customers */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Top Customers</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Tier</th>
                    <th>Current Points</th>
                    <th>Lifetime Points</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.topCustomers.map((customer) => (
                    <tr key={customer.customerId}>
                      <td>{customer.customerName}</td>
                      <td>
                        <span className="badge bg-primary">{customer.tierName}</span>
                      </td>
                      <td>{customer.currentPoints.toLocaleString()}</td>
                      <td>{customer.lifetimePoints.toLocaleString()}</td>
                      <td>${customer.totalSpent.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Recent Transactions</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Points</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                      <td>
                        <span className={`badge bg-${
                          transaction.type === 'EARN' || transaction.type === 'BONUS' ? 'success' :
                          transaction.type === 'REDEEM' ? 'warning' :
                          'secondary'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>
                        {transaction.type === 'EARN' || transaction.type === 'BONUS' ? '+' : '-'}
                        {transaction.points}
                      </td>
                      <td>{transaction.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reward Statistics */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Reward Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <h6 className="text-muted">Total Rewards</h6>
                  <h4>{dashboard.rewardStats.totalRewards}</h4>
                </Col>
                <Col md={3}>
                  <h6 className="text-muted">Active Rewards</h6>
                  <h4>{dashboard.rewardStats.activeRewards}</h4>
                </Col>
                <Col md={3}>
                  <h6 className="text-muted">Total Redemptions</h6>
                  <h4>{dashboard.rewardStats.totalRedemptions}</h4>
                </Col>
                <Col md={3}>
                  <h6 className="text-muted">Most Popular</h6>
                  <h4>{dashboard.rewardStats.mostPopularReward?.name || 'N/A'}</h4>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoyaltyDashboard;
