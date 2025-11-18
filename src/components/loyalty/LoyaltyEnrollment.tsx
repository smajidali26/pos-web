/**
 * Loyalty Enrollment Component - Enroll Customer in Program
 */

import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { EnrollCustomerRequest } from '../../types/loyalty';
import { toast } from 'react-toastify';

interface LoyaltyEnrollmentProps {
  show: boolean;
  onHide: () => void;
  customerId?: string;
  customerName?: string;
  onEnrollSuccess?: () => void;
}

const LoyaltyEnrollment: React.FC<LoyaltyEnrollmentProps> = ({
  show,
  onHide,
  customerId,
  customerName,
  onEnrollSuccess
}) => {
  const { program, tiers, loading, error, fetchProgram, fetchTiers, enrollCustomer } = useLoyalty();
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  useEffect(() => {
    if (show) {
      fetchProgram();
    }
  }, [show, fetchProgram]);

  useEffect(() => {
    if (program) {
      fetchTiers(program.id);
    }
  }, [program, fetchTiers]);

  useEffect(() => {
    // Auto-select the first (lowest) tier
    if (tiers.length > 0 && !selectedTierId) {
      const sortedTiers = [...tiers].sort((a, b) => a.order - b.order);
      setSelectedTierId(sortedTiers[0].id);
    }
  }, [tiers, selectedTierId]);

  const handleEnroll = () => {
    if (!customerId || !program) {
      toast.error('Missing customer or program information');
      return;
    }

    const enrollData: EnrollCustomerRequest = {
      customerId,
      programId: program.id,
      tierId: selectedTierId || undefined
    };

    enrollCustomer(enrollData);
    toast.success(`${customerName} enrolled in loyalty program successfully`);
    onEnrollSuccess?.();
    onHide();
  };

  if (loading.program && !program) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    );
  }

  if (error.program) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Enrollment Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">{error.program}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (!program) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Enrollment Not Available</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            No loyalty program is currently configured. Please set up a loyalty program first.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Enroll in Loyalty Program</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Customer Info */}
        <Alert variant="info">
          <strong>Enrolling:</strong> {customerName || 'Unknown Customer'}
        </Alert>

        {/* Program Information */}
        <Card className="mb-4">
          <Card.Header>
            <h5>{program.name}</h5>
          </Card.Header>
          <Card.Body>
            <p>{program.description}</p>
            <div className="mb-2">
              <strong>Benefits:</strong>
              <ul className="mt-2">
                <li>Earn {program.pointsPerDollar} point{program.pointsPerDollar !== 1 ? 's' : ''} per dollar spent</li>
                {program.minimumPurchaseAmount > 0 && (
                  <li>Minimum purchase: ${program.minimumPurchaseAmount.toFixed(2)}</li>
                )}
                {program.pointsExpiryDays > 0 && (
                  <li>Points expire after {program.pointsExpiryDays} days</li>
                )}
                <li>Access to exclusive rewards</li>
                <li>Tier-based benefits and multipliers</li>
              </ul>
            </div>
            <Badge bg={program.isActive ? 'success' : 'danger'}>
              {program.isActive ? 'Active Program' : 'Inactive Program'}
            </Badge>
          </Card.Body>
        </Card>

        {/* Tier Selection */}
        {tiers.length > 0 && (
          <div>
            <h5 className="mb-3">Select Starting Tier</h5>
            <Form.Group>
              {tiers.sort((a, b) => a.order - b.order).map(tier => (
                <div key={tier.id} className="mb-2">
                  <Card
                    className={`cursor-pointer ${selectedTierId === tier.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedTierId(tier.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <Form.Check
                        type="radio"
                        name="tier"
                        checked={selectedTierId === tier.id}
                        onChange={() => setSelectedTierId(tier.id)}
                        className="me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <Badge
                            bg="primary"
                            style={{ backgroundColor: tier.color }}
                            className="me-2"
                          >
                            {tier.name}
                          </Badge>
                          {tier.order === 0 && <Badge bg="info">Default</Badge>}
                        </div>
                        <p className="mb-1 small">{tier.description}</p>
                        <div className="small text-muted">
                          <strong>Benefits:</strong>
                          <ul className="mb-0 ps-3">
                            <li>{tier.pointsMultiplier}x points multiplier</li>
                            {tier.discountPercentage > 0 && (
                              <li>{tier.discountPercentage}% discount</li>
                            )}
                            {tier.benefits.slice(0, 2).map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Form.Group>
          </div>
        )}

        {error.customers && <Alert variant="danger" className="mt-3">{error.customers}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleEnroll}
          disabled={loading.customers || !selectedTierId}
        >
          {loading.customers ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Enrolling...
            </>
          ) : (
            'Enroll Customer'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoyaltyEnrollment;
