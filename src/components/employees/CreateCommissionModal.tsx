import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createCommissionRequest } from '../../store/employees/commissionsSlice';
import { CommissionType, CommissionBasis } from '../../services/commissionService';

interface CreateCommissionModalProps {
  show: boolean;
  onHide: () => void;
}

export const CreateCommissionModal: React.FC<CreateCommissionModalProps> = ({ show, onHide }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    commissionType: CommissionType.Percentage,
    commissionBasis: CommissionBasis.TotalSale,
    rate: 0,
    minimumSaleAmount: 0,
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createCommissionRequest(formData));
    onHide();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Commission Rule</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Commission Type *</Form.Label>
                <Form.Control
                  as="select"
                  name="commissionType"
                  value={formData.commissionType}
                  onChange={handleChange}
                  required
                >
                  {Object.values(CommissionType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Commission Basis *</Form.Label>
                <Form.Control
                  as="select"
                  name="commissionBasis"
                  value={formData.commissionBasis}
                  onChange={handleChange}
                  required
                >
                  {Object.values(CommissionBasis).map(basis => (
                    <option key={basis} value={basis}>{basis}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Rate *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Minimum Sale Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="minimumSaleAmount"
                  value={formData.minimumSaleAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Effective From *</Form.Label>
            <Form.Control
              type="date"
              name="effectiveFrom"
              value={formData.effectiveFrom}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Rule
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
