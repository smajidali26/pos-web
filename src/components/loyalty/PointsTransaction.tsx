/**
 * Points Transaction Component - Earn/Redeem/Adjust Points
 */

import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { EarnPointsRequest, RedeemPointsRequest, AdjustPointsRequest } from '../../types/loyalty';
import { toast } from 'react-toastify';

interface PointsTransactionProps {
  customerLoyaltyId: string;
  currentPoints: number;
  transactionType: 'earn' | 'redeem' | 'adjust';
  onSuccess?: () => void;
}

const PointsTransaction: React.FC<PointsTransactionProps> = ({
  customerLoyaltyId,
  currentPoints,
  transactionType,
  onSuccess
}) => {
  const { loading, earnPoints, redeemPoints, adjustPoints } = useLoyalty();
  const [formData, setFormData] = useState({
    points: 0,
    description: '',
    orderId: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    }));
    setValidationError(null);
  };

  const validateRedemption = () => {
    if (transactionType === 'redeem') {
      if (formData.points > currentPoints) {
        setValidationError(`Insufficient points. Customer has ${currentPoints} points available.`);
        return false;
      }
      if (formData.points <= 0) {
        setValidationError('Points must be greater than 0');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRedemption()) {
      return;
    }

    try {
      if (transactionType === 'earn') {
        const data: EarnPointsRequest = {
          customerLoyaltyId,
          points: formData.points,
          description: formData.description,
          orderId: formData.orderId || undefined
        };
        earnPoints(data);
        toast.success(`${formData.points} points earned successfully`);
      } else if (transactionType === 'redeem') {
        const data: RedeemPointsRequest = {
          customerLoyaltyId,
          points: formData.points,
          description: formData.description,
          orderId: formData.orderId || undefined
        };
        redeemPoints(data);
        toast.success(`${formData.points} points redeemed successfully`);
      } else if (transactionType === 'adjust') {
        const data: AdjustPointsRequest = {
          customerLoyaltyId,
          points: formData.points,
          description: formData.description
        };
        adjustPoints(data);
        toast.success('Points adjusted successfully');
      }

      // Reset form
      setFormData({ points: 0, description: '', orderId: '' });
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to process transaction');
    }
  };

  const pointsValue = (formData.points * 0.01).toFixed(2); // Assuming 100 points = $1

  return (
    <Form onSubmit={handleSubmit}>
      {validationError && <Alert variant="danger">{validationError}</Alert>}

      <Alert variant="info">
        <strong>Current Balance:</strong> {currentPoints.toLocaleString()} points
      </Alert>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              {transactionType === 'earn' ? 'Points to Earn' :
               transactionType === 'redeem' ? 'Points to Redeem' :
               'Points Adjustment'}
            </Form.Label>
            <Form.Control
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              required
              min={transactionType === 'adjust' ? undefined : 1}
              placeholder="Enter points amount"
            />
            {transactionType !== 'adjust' && (
              <Form.Text className="text-muted">
                Estimated value: ${pointsValue}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Order ID (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              placeholder="Link to order"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder={
            transactionType === 'earn' ? 'e.g., Purchase reward, Bonus points' :
            transactionType === 'redeem' ? 'e.g., Reward redemption, Discount applied' :
            'Reason for adjustment'
          }
        />
      </Form.Group>

      {transactionType === 'redeem' && formData.points > 0 && (
        <Alert variant="warning">
          <strong>Confirm:</strong> You are about to redeem {formData.points} points from this customer's account.
        </Alert>
      )}

      {transactionType === 'adjust' && (
        <Alert variant="info">
          <strong>Note:</strong> Use positive numbers to add points, negative numbers to subtract points.
        </Alert>
      )}

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" type="button" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          variant={
            transactionType === 'earn' ? 'success' :
            transactionType === 'redeem' ? 'warning' :
            'info'
          }
          type="submit"
          disabled={loading.transactions || formData.points === 0}
        >
          {loading.transactions ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Processing...
            </>
          ) : (
            transactionType === 'earn' ? 'Earn Points' :
            transactionType === 'redeem' ? 'Redeem Points' :
            'Adjust Points'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default PointsTransaction;
