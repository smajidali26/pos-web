/**
 * Customer Tier Settings Component
 */

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { CreateTierRequest, UpdateTierRequest, CustomerTier } from '../../types/loyalty';
import { toast } from 'react-toastify';

interface CustomerTierSettingsProps {
  programId: string;
}

const CustomerTierSettings: React.FC<CustomerTierSettingsProps> = ({ programId }) => {
  const { tiers, loading, error, fetchTiers, createTier, updateTier, deleteTier } = useLoyalty();
  const [showModal, setShowModal] = useState(false);
  const [editingTier, setEditingTier] = useState<CustomerTier | null>(null);
  const [formData, setFormData] = useState<Omit<CreateTierRequest, 'programId'>>({
    name: '',
    description: '',
    minimumPoints: 0,
    pointsMultiplier: 1,
    discountPercentage: 0,
    color: '#007bff',
    benefits: [],
    order: 0
  });
  const [benefitInput, setBenefitInput] = useState('');

  useEffect(() => {
    if (programId) {
      fetchTiers(programId);
    }
  }, [programId, fetchTiers]);

  const handleOpenModal = (tier?: CustomerTier) => {
    if (tier) {
      setEditingTier(tier);
      setFormData({
        name: tier.name,
        description: tier.description,
        minimumPoints: tier.minimumPoints,
        pointsMultiplier: tier.pointsMultiplier,
        discountPercentage: tier.discountPercentage,
        color: tier.color,
        benefits: tier.benefits,
        order: tier.order
      });
    } else {
      setEditingTier(null);
      setFormData({
        name: '',
        description: '',
        minimumPoints: 0,
        pointsMultiplier: 1,
        discountPercentage: 0,
        color: '#007bff',
        benefits: [],
        order: tiers.length
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTier(null);
    setBenefitInput('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTier) {
      const updateData: UpdateTierRequest = {
        id: editingTier.id,
        ...formData
      };
      updateTier(updateData);
      toast.success('Tier updated successfully');
    } else {
      const createData: CreateTierRequest = {
        programId,
        ...formData
      };
      createTier(createData);
      toast.success('Tier created successfully');
    }
    handleCloseModal();
  };

  const handleDelete = (tierId: string, tierName: string) => {
    if (window.confirm(`Are you sure you want to delete the tier "${tierName}"?`)) {
      deleteTier(tierId);
      toast.success('Tier deleted successfully');
    }
  };

  if (loading.tiers && tiers.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {error.tiers && <Alert variant="danger">{error.tiers}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Customer Tiers</h5>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Create New Tier
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Minimum Points</th>
            <th>Multiplier</th>
            <th>Discount %</th>
            <th>Benefits</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tiers.sort((a, b) => a.order - b.order).map((tier) => (
            <tr key={tier.id}>
              <td>{tier.order + 1}</td>
              <td>
                <Badge bg="primary" style={{ backgroundColor: tier.color }}>
                  {tier.name}
                </Badge>
              </td>
              <td>{tier.minimumPoints.toLocaleString()}</td>
              <td>{tier.pointsMultiplier}x</td>
              <td>{tier.discountPercentage}%</td>
              <td>
                <ul className="mb-0 ps-3">
                  {tier.benefits.slice(0, 2).map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                  {tier.benefits.length > 2 && <li>+{tier.benefits.length - 2} more</li>}
                </ul>
              </td>
              <td>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: tier.color,
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                  }}
                />
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpenModal(tier)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(tier.id, tier.name)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {tiers.length === 0 && (
        <Alert variant="info">
          No tiers configured. Create your first tier to get started!
        </Alert>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingTier ? 'Edit Tier' : 'Create New Tier'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tier Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Bronze, Silver, Gold"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this tier..."
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Points</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumPoints"
                    value={formData.minimumPoints}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Points Multiplier</Form.Label>
                  <Form.Control
                    type="number"
                    name="pointsMultiplier"
                    value={formData.pointsMultiplier}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.1"
                  />
                  <Form.Text className="text-muted">1.5 = 50% bonus</Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Tier Color</Form.Label>
              <Form.Control
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Benefits</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                />
                <Button variant="secondary" onClick={handleAddBenefit}>
                  Add
                </Button>
              </div>
              {formData.benefits.length > 0 && (
                <ul className="list-group">
                  {formData.benefits.map((benefit, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {benefit}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveBenefit(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading.tiers}>
              {loading.tiers ? (
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
                editingTier ? 'Update Tier' : 'Create Tier'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerTierSettings;
