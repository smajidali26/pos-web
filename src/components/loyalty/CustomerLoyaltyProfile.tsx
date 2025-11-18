/**
 * Customer Loyalty Profile Component
 */

import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, ProgressBar, Table, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useLoyalty } from '../../hooks/useLoyalty';
import { format } from 'date-fns';
import PointsTransaction from './PointsTransaction';

const CustomerLoyaltyProfile: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const {
    currentCustomerLoyalty,
    transactions,
    rewards,
    expiringPoints,
    loading,
    error,
    fetchCustomerLoyalty,
    fetchTransactions,
    fetchRewards,
    fetchExpiringPoints,
    program
  } = useLoyalty();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'earn' | 'redeem' | 'adjust'>('earn');

  useEffect(() => {
    if (customerId) {
      fetchCustomerLoyalty(customerId);
      fetchExpiringPoints(customerId, 30);
    }
  }, [customerId, fetchCustomerLoyalty, fetchExpiringPoints]);

  useEffect(() => {
    if (currentCustomerLoyalty) {
      fetchTransactions(currentCustomerLoyalty.id);
      if (program) {
        fetchRewards(program.id);
      }
    }
  }, [currentCustomerLoyalty, fetchTransactions, fetchRewards, program]);

  const handleOpenTransactionModal = (type: 'earn' | 'redeem' | 'adjust') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  if (loading.customers && !currentCustomerLoyalty) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error.customers) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error.customers}</Alert>
      </Container>
    );
  }

  if (!currentCustomerLoyalty) {
    return (
      <Container className="py-4">
        <Alert variant="info">Customer not enrolled in loyalty program</Alert>
      </Container>
    );
  }

  const tierProgress = currentCustomerLoyalty.tier && currentCustomerLoyalty.pointsToNextTier
    ? ((currentCustomerLoyalty.currentPoints / (currentCustomerLoyalty.currentPoints + currentCustomerLoyalty.pointsToNextTier)) * 100)
    : 100;

  const expiringPointsTotal = expiringPoints.reduce((sum, ep) => sum + ep.points, 0);

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Customer Loyalty Profile</h2>

      {/* Customer Info Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h4>{currentCustomerLoyalty.customer?.name}</h4>
              <p className="mb-1">
                <strong>Email:</strong> {currentCustomerLoyalty.customer?.email}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {currentCustomerLoyalty.customer?.phone}
              </p>
              <p className="mb-0">
                <strong>Member Since:</strong> {format(new Date(currentCustomerLoyalty.enrollmentDate), 'MMM dd, yyyy')}
              </p>
            </Col>
            <Col md={4} className="text-end">
              <Badge
                bg={currentCustomerLoyalty.status === 'ACTIVE' ? 'success' : 'danger'}
                className="mb-2"
              >
                {currentCustomerLoyalty.status}
              </Badge>
              <br />
              <Badge
                bg="primary"
                style={{ backgroundColor: currentCustomerLoyalty.tier?.color }}
              >
                {currentCustomerLoyalty.tier?.name || 'No Tier'}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Points and Tier Progress */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6 className="text-muted">Current Points</h6>
              <h2 className="mb-0">{currentCustomerLoyalty.currentPoints.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6 className="text-muted">Lifetime Points</h6>
              <h2 className="mb-0">{currentCustomerLoyalty.lifetimePoints.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6 className="text-muted">Expiring Soon (30 days)</h6>
              <h2 className="mb-0 text-warning">{expiringPointsTotal.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tier Progress */}
      {currentCustomerLoyalty.tier && currentCustomerLoyalty.pointsToNextTier > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between mb-2">
              <span>Progress to Next Tier</span>
              <span>{currentCustomerLoyalty.pointsToNextTier} points needed</span>
            </div>
            <ProgressBar now={tierProgress} label={`${tierProgress.toFixed(0)}%`} />
          </Card.Body>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => handleOpenTransactionModal('earn')}>
              Earn Points
            </Button>
            <Button variant="warning" onClick={() => handleOpenTransactionModal('redeem')}>
              Redeem Points
            </Button>
            <Button variant="info" onClick={() => handleOpenTransactionModal('adjust')}>
              Adjust Points
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Available Rewards */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Available Rewards</h5>
        </Card.Header>
        <Card.Body>
          {rewards.filter(r => r.isActive && r.pointsCost <= currentCustomerLoyalty.currentPoints).length > 0 ? (
            <Row>
              {rewards
                .filter(r => r.isActive && r.pointsCost <= currentCustomerLoyalty.currentPoints)
                .slice(0, 3)
                .map(reward => (
                  <Col md={4} key={reward.id}>
                    <Card className="mb-3">
                      <Card.Body>
                        <h6>{reward.name}</h6>
                        <p className="small text-muted">{reward.description}</p>
                        <Badge bg="primary">{reward.pointsCost} points</Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          ) : (
            <Alert variant="info">
              No rewards available with current points balance
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Transaction History */}
      <Card>
        <Card.Header>
          <h5>Transaction History</h5>
        </Card.Header>
        <Card.Body>
          {loading.transactions ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : transactions.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Description</th>
                  <th>Order ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                    <td>
                      <Badge bg={
                        transaction.type === 'EARN' || transaction.type === 'BONUS' ? 'success' :
                        transaction.type === 'REDEEM' ? 'warning' :
                        'secondary'
                      }>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className={
                      transaction.type === 'EARN' || transaction.type === 'BONUS' ? 'text-success' :
                      transaction.type === 'REDEEM' ? 'text-danger' :
                      ''
                    }>
                      {transaction.type === 'EARN' || transaction.type === 'BONUS' ? '+' : '-'}
                      {transaction.points}
                    </td>
                    <td>{transaction.description}</td>
                    <td>{transaction.orderId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No transactions found</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Points Transaction Modal */}
      <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {transactionType === 'earn' ? 'Earn Points' :
             transactionType === 'redeem' ? 'Redeem Points' :
             'Adjust Points'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCustomerLoyalty && (
            <PointsTransaction
              customerLoyaltyId={currentCustomerLoyalty.id}
              currentPoints={currentCustomerLoyalty.currentPoints}
              transactionType={transactionType}
              onSuccess={() => {
                setShowTransactionModal(false);
                if (customerId) {
                  fetchCustomerLoyalty(customerId);
                }
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomerLoyaltyProfile;
