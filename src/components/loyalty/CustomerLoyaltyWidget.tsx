/**
 * Customer Loyalty Widget - Small widget for customer profile/checkout
 */

import React, { useEffect } from 'react';
import { Card, Badge, ProgressBar, Button, Spinner } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { useNavigate } from 'react-router-dom';

interface CustomerLoyaltyWidgetProps {
  customerId: string;
  onRedeemClick?: () => void;
  showActions?: boolean;
}

const CustomerLoyaltyWidget: React.FC<CustomerLoyaltyWidgetProps> = ({
  customerId,
  onRedeemClick,
  showActions = true
}) => {
  const { currentCustomerLoyalty, loading, fetchCustomerLoyalty } = useLoyalty();
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId) {
      fetchCustomerLoyalty(customerId);
    }
  }, [customerId, fetchCustomerLoyalty]);

  const handleViewProfile = () => {
    navigate(`/loyalty/customer/${customerId}`);
  };

  if (loading.customers) {
    return (
      <Card>
        <Card.Body className="text-center py-3">
          <Spinner animation="border" size="sm" />
        </Card.Body>
      </Card>
    );
  }

  if (!currentCustomerLoyalty) {
    return (
      <Card>
        <Card.Body className="text-center py-3">
          <p className="text-muted mb-0">Not enrolled in loyalty program</p>
        </Card.Body>
      </Card>
    );
  }

  const tierProgress = currentCustomerLoyalty.tier && currentCustomerLoyalty.pointsToNextTier > 0
    ? ((currentCustomerLoyalty.currentPoints / (currentCustomerLoyalty.currentPoints + currentCustomerLoyalty.pointsToNextTier)) * 100)
    : 100;

  return (
    <Card className="loyalty-widget">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">Loyalty Status</span>
        {currentCustomerLoyalty.tier && (
          <Badge
            bg="primary"
            style={{ backgroundColor: currentCustomerLoyalty.tier.color }}
          >
            {currentCustomerLoyalty.tier.name}
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        {/* Points Display */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted">Current Points</span>
            <strong className="h5 mb-0">
              {currentCustomerLoyalty.currentPoints.toLocaleString()}
            </strong>
          </div>
          <small className="text-muted">
            Lifetime: {currentCustomerLoyalty.lifetimePoints.toLocaleString()} pts
          </small>
        </div>

        {/* Tier Progress */}
        {currentCustomerLoyalty.tier && currentCustomerLoyalty.pointsToNextTier > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted">Next Tier</small>
              <small className="text-muted">
                {currentCustomerLoyalty.pointsToNextTier} pts needed
              </small>
            </div>
            <ProgressBar
              now={tierProgress}
              variant="success"
              style={{ height: '8px' }}
            />
          </div>
        )}

        {/* Quick Actions */}
        {showActions && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleViewProfile}
              className="flex-grow-1"
            >
              View Profile
            </Button>
            {onRedeemClick && currentCustomerLoyalty.currentPoints > 0 && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={onRedeemClick}
                className="flex-grow-1"
              >
                Redeem
              </Button>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="mt-2 text-center">
          <Badge bg={
            currentCustomerLoyalty.status === 'ACTIVE' ? 'success' :
            currentCustomerLoyalty.status === 'INACTIVE' ? 'secondary' :
            'danger'
          }>
            {currentCustomerLoyalty.status}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomerLoyaltyWidget;
