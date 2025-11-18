/**
 * Loyalty Program Settings Component
 */

import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { CreateLoyaltyProgramRequest, UpdateLoyaltyProgramRequest } from '../../types/loyalty';
import { toast } from 'react-toastify';
import CustomerTierSettings from './CustomerTierSettings';

const LoyaltyProgramSettings: React.FC = () => {
  const { program, loading, error, fetchProgram, createProgram, updateProgram } = useLoyalty();

  const [formData, setFormData] = useState<CreateLoyaltyProgramRequest>({
    name: '',
    description: '',
    pointsPerDollar: 1,
    minimumPurchaseAmount: 0,
    pointsExpiryDays: 365,
    isActive: true
  });

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        description: program.description,
        pointsPerDollar: program.pointsPerDollar,
        minimumPurchaseAmount: program.minimumPurchaseAmount,
        pointsExpiryDays: program.pointsExpiryDays,
        isActive: program.isActive
      });
    }
  }, [program]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (program) {
      const updateData: UpdateLoyaltyProgramRequest = {
        id: program.id,
        ...formData
      };
      updateProgram(updateData);
      toast.success('Loyalty program updated successfully');
    } else {
      createProgram(formData);
      toast.success('Loyalty program created successfully');
    }
  };

  if (loading.program && !program) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Loyalty Program Settings</h2>

      {error.program && <Alert variant="danger">{error.program}</Alert>}

      <Tabs defaultActiveKey="program" className="mb-3">
        <Tab eventKey="program" title="Program Configuration">
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Program Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., VIP Rewards Program"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Check
                        type="switch"
                        id="isActive"
                        name="isActive"
                        label={formData.isActive ? 'Active' : 'Inactive'}
                        checked={formData.isActive}
                        onChange={handleChange}
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
                    placeholder="Describe your loyalty program..."
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Points Per Dollar Spent</Form.Label>
                      <Form.Control
                        type="number"
                        name="pointsPerDollar"
                        value={formData.pointsPerDollar}
                        onChange={handleChange}
                        min="0.1"
                        step="0.1"
                        required
                      />
                      <Form.Text className="text-muted">
                        Base points earned per dollar spent
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Minimum Purchase Amount ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="minimumPurchaseAmount"
                        value={formData.minimumPurchaseAmount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                      <Form.Text className="text-muted">
                        Minimum purchase to earn points
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Points Expiry (Days)</Form.Label>
                      <Form.Control
                        type="number"
                        name="pointsExpiryDays"
                        value={formData.pointsExpiryDays}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                      <Form.Text className="text-muted">
                        Days until points expire (0 = never)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={() => fetchProgram()}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading.program}>
                    {loading.program ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      program ? 'Update Program' : 'Create Program'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {program && (
            <Card className="mt-3">
              <Card.Body>
                <h5>Program Information</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Program ID:</strong> {program.id}</p>
                    <p><strong>Created:</strong> {new Date(program.createdAt).toLocaleString()}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Last Updated:</strong> {new Date(program.updatedAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span className={`badge bg-${program.isActive ? 'success' : 'danger'}`}>
                      {program.isActive ? 'Active' : 'Inactive'}
                    </span></p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab eventKey="tiers" title="Customer Tiers">
          {program ? (
            <CustomerTierSettings programId={program.id} />
          ) : (
            <Alert variant="info">Please create a loyalty program first</Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LoyaltyProgramSettings;
