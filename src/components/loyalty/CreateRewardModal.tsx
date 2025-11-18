/**
 * Create/Edit Reward Modal Component
 */

import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useLoyalty } from '../../hooks/useLoyalty';
import { CreateRewardRequest, UpdateRewardRequest, Reward, RewardType } from '../../types/loyalty';
import { toast } from 'react-toastify';

interface CreateRewardModalProps {
  show: boolean;
  onHide: () => void;
  programId: string;
  reward?: Reward;
}

const CreateRewardModal: React.FC<CreateRewardModalProps> = ({
  show,
  onHide,
  programId,
  reward
}) => {
  const { loading, createReward, updateReward } = useLoyalty();
  const [formData, setFormData] = useState<Omit<CreateRewardRequest, 'programId'>>({
    name: '',
    description: '',
    type: RewardType.DISCOUNT_PERCENTAGE,
    pointsCost: 0,
    value: 0,
    productId: undefined,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: undefined,
    isActive: true,
    redemptionLimit: undefined,
    imageUrl: '',
    termsAndConditions: ''
  });

  useEffect(() => {
    if (reward) {
      setFormData({
        name: reward.name,
        description: reward.description,
        type: reward.type,
        pointsCost: reward.pointsCost,
        value: reward.value,
        productId: reward.productId,
        validFrom: reward.validFrom.split('T')[0],
        validUntil: reward.validUntil ? reward.validUntil.split('T')[0] : undefined,
        isActive: reward.isActive,
        redemptionLimit: reward.redemptionLimit,
        imageUrl: reward.imageUrl,
        termsAndConditions: reward.termsAndConditions
      });
    } else {
      // Reset form when creating new
      setFormData({
        name: '',
        description: '',
        type: RewardType.DISCOUNT_PERCENTAGE,
        pointsCost: 0,
        value: 0,
        productId: undefined,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: undefined,
        isActive: true,
        redemptionLimit: undefined,
        imageUrl: '',
        termsAndConditions: ''
      });
    }
  }, [reward, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 :
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value === '' ? undefined : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (reward) {
      const updateData: UpdateRewardRequest = {
        id: reward.id,
        ...formData
      };
      updateReward(updateData);
      toast.success('Reward updated successfully');
    } else {
      const createData: CreateRewardRequest = {
        programId,
        ...formData
      };
      createReward(createData);
      toast.success('Reward created successfully');
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{reward ? 'Edit Reward' : 'Create New Reward'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Reward Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 10% Off Next Purchase"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
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
              required
              placeholder="Describe the reward..."
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Reward Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value={RewardType.DISCOUNT_PERCENTAGE}>Discount Percentage</option>
                  <option value={RewardType.DISCOUNT_FIXED}>Fixed Discount</option>
                  <option value={RewardType.FREE_PRODUCT}>Free Product</option>
                  <option value={RewardType.FREE_SHIPPING}>Free Shipping</option>
                  <option value={RewardType.CUSTOM}>Custom</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Points Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="pointsCost"
                  value={formData.pointsCost}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  {formData.type === RewardType.DISCOUNT_PERCENTAGE ? 'Discount %' :
                   formData.type === RewardType.DISCOUNT_FIXED ? 'Discount Amount ($)' :
                   'Value'}
                </Form.Label>
                <Form.Control
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </Col>
          </Row>

          {formData.type === RewardType.FREE_PRODUCT && (
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={formData.productId || ''}
                onChange={handleChange}
                placeholder="Enter product ID"
              />
            </Form.Group>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Valid From</Form.Label>
                <Form.Control
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Valid Until (Optional)</Form.Label>
                <Form.Control
                  type="date"
                  name="validUntil"
                  value={formData.validUntil || ''}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Redemption Limit (Optional)</Form.Label>
            <Form.Control
              type="number"
              name="redemptionLimit"
              value={formData.redemptionLimit || ''}
              onChange={handleChange}
              min="1"
              placeholder="Leave empty for unlimited"
            />
            <Form.Text className="text-muted">
              Maximum number of times this reward can be redeemed
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Terms and Conditions (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="termsAndConditions"
              value={formData.termsAndConditions || ''}
              onChange={handleChange}
              placeholder="Enter any terms and conditions..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading.rewards}>
            {loading.rewards ? (
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
              reward ? 'Update Reward' : 'Create Reward'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateRewardModal;
