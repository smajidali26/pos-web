import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { Store, StoreType, CreateStoreRequest, UpdateStoreRequest } from '../../types/store';
import { useStores } from '../../hooks/useStores';

interface StoreModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (store: CreateStoreRequest | UpdateStoreRequest) => void;
  store?: Store | null;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const StoreModal: React.FC<StoreModalProps> = ({
  show,
  onClose,
  onSave,
  store
}) => {
  const { stores, isLoading, error } = useStores();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    storeType: StoreType.RETAIL,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    email: '',
    managerId: '',
    parentStoreId: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        code: store.code,
        storeType: store.storeType,
        address: store.address,
        city: store.city,
        state: store.state,
        zipCode: store.zipCode,
        country: store.country,
        phone: store.phone,
        email: store.email,
        managerId: store.managerId || '',
        parentStoreId: store.parentStoreId || ''
      });
    } else {
      resetForm();
    }
  }, [store, show]);

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      storeType: StoreType.RETAIL,
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      phone: '',
      email: '',
      managerId: '',
      parentStoreId: ''
    });
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Store name is required';
    }

    if (!formData.code.trim()) {
      errors.code = 'Store code is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state) {
      errors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      errors.zipCode = 'Invalid ZIP code format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone must be 10 digits';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanedData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, ''),
      managerId: formData.managerId || undefined,
      parentStoreId: formData.parentStoreId || undefined
    };

    if (store) {
      const { code, storeType, ...updateData } = cleanedData;
      onSave(updateData as UpdateStoreRequest);
    } else {
      onSave(cleanedData as CreateStoreRequest);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: value });
  };

  const availableParentStores = stores.filter(s =>
    s.id !== store?.id && s.storeType === StoreType.WAREHOUSE
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {store ? 'Edit Store' : 'Add New Store'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Store Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  isInvalid={!!validationErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Store Code <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  isInvalid={!!validationErrors.code}
                  disabled={!!store}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.code}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Store Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.storeType}
                  onChange={(e) => setFormData({ ...formData, storeType: e.target.value as StoreType })}
                  disabled={!!store}
                >
                  <option value={StoreType.WAREHOUSE}>Warehouse</option>
                  <option value={StoreType.RETAIL}>Retail</option>
                  <option value={StoreType.BRANCH}>Branch</option>
                  <option value={StoreType.OUTLET}>Outlet</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Parent Store</Form.Label>
                <Form.Select
                  value={formData.parentStoreId}
                  onChange={(e) => setFormData({ ...formData, parentStoreId: e.target.value })}
                  disabled={formData.storeType === StoreType.WAREHOUSE}
                >
                  <option value="">None (Root Store)</option>
                  {availableParentStores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Only Warehouse stores can be parent stores
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  isInvalid={!!validationErrors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.address}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={5}>
              <Form.Group>
                <Form.Label>City <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  isInvalid={!!validationErrors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>State <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  isInvalid={!!validationErrors.state}
                >
                  <option value="">Select...</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>ZIP Code <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  isInvalid={!!validationErrors.zipCode}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.zipCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(555) 123-4567"
                  isInvalid={!!validationErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  isInvalid={!!validationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StoreModal;
