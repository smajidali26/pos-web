/**
 * Reward Redemptions Component - Customer's Redeemed Rewards
 */

import React, { useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { format } from 'date-fns';

interface RewardRedemptionsProps {
  customerId: string;
}

const RewardRedemptions: React.FC<RewardRedemptionsProps> = ({ customerId }) => {
  const { redemptions, loading, error, fetchRedemptions, updateRedemptionStatus } = useLoyalty();

  useEffect(() => {
    if (customerId) {
      fetchRedemptions(customerId);
    }
  }, [customerId, fetchRedemptions]);

  const handleStatusUpdate = (
    redemptionId: string,
    status: 'PENDING' | 'REDEEMED' | 'USED' | 'EXPIRED' | 'CANCELLED'
  ) => {
    updateRedemptionStatus(redemptionId, status);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="warning">Pending</Badge>;
      case 'REDEEMED':
        return <Badge bg="success">Redeemed</Badge>;
      case 'USED':
        return <Badge bg="info">Used</Badge>;
      case 'EXPIRED':
        return <Badge bg="danger">Expired</Badge>;
      case 'CANCELLED':
        return <Badge bg="secondary">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading.redemptions && redemptions.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error.redemptions) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error.redemptions}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Reward Redemptions</h2>

      <Card>
        <Card.Body>
          {redemptions.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date Redeemed</th>
                  <th>Reward</th>
                  <th>Points Used</th>
                  <th>Status</th>
                  <th>Redemption Code</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((redemption) => (
                  <tr key={redemption.id}>
                    <td>{format(new Date(redemption.redeemedAt), 'MMM dd, yyyy HH:mm')}</td>
                    <td>
                      <div>
                        <strong>{redemption.reward?.name}</strong>
                        <br />
                        <small className="text-muted">{redemption.reward?.description}</small>
                      </div>
                    </td>
                    <td>{redemption.pointsUsed}</td>
                    <td>{getStatusBadge(redemption.status)}</td>
                    <td>
                      <code>{redemption.redemptionCode}</code>
                    </td>
                    <td>
                      {redemption.expiryDate ? (
                        <div>
                          {format(new Date(redemption.expiryDate), 'MMM dd, yyyy')}
                          {isExpiringSoon(redemption.expiryDate) && (
                            <Badge bg="warning" className="ms-2">Expiring Soon</Badge>
                          )}
                          {isExpired(redemption.expiryDate) && (
                            <Badge bg="danger" className="ms-2">Expired</Badge>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {redemption.status === 'REDEEMED' && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleStatusUpdate(redemption.id, 'USED')}
                        >
                          Mark as Used
                        </Button>
                      )}
                      {redemption.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleStatusUpdate(redemption.id, 'REDEEMED')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleStatusUpdate(redemption.id, 'CANCELLED')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {(redemption.status === 'USED' || redemption.status === 'EXPIRED') && (
                        <span className="text-muted">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No redemptions found</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Summary Card */}
      <Card className="mt-4">
        <Card.Header>
          <h5>Redemption Summary</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-around">
            <div className="text-center">
              <h4>{redemptions.filter(r => r.status === 'REDEEMED').length}</h4>
              <p className="text-muted">Redeemed</p>
            </div>
            <div className="text-center">
              <h4>{redemptions.filter(r => r.status === 'USED').length}</h4>
              <p className="text-muted">Used</p>
            </div>
            <div className="text-center">
              <h4>{redemptions.filter(r => r.status === 'PENDING').length}</h4>
              <p className="text-muted">Pending</p>
            </div>
            <div className="text-center">
              <h4>{redemptions.reduce((sum, r) => sum + r.pointsUsed, 0).toLocaleString()}</h4>
              <p className="text-muted">Total Points Used</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RewardRedemptions;
