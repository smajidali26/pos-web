import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

interface Vendor {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  website: string;
  type: string;
  paymentTerms: string;
  creditLimit: number;
  notes: string;
}

interface VendorModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (vendor: any) => void;
  vendor?: Vendor | null;
  isLoading?: boolean;
  error?: string | null;
}

export const VendorModal: React.FC<VendorModalProps> = ({
  show,
  onClose,
  onSave,
  vendor,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    taxId: '',
    website: '',
    type: 'Supplier',
    paymentTerms: 'Net30',
    creditLimit: '0',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        email: vendor.email,
        phoneNumber: vendor.phoneNumber,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zipCode: vendor.zipCode,
        country: vendor.country,
        taxId: vendor.taxId || '',
        website: vendor.website || '',
        type: vendor.type,
        paymentTerms: vendor.paymentTerms,
        creditLimit: vendor.creditLimit.toString(),
        notes: vendor.notes || ''
      });
    } else {
      resetForm();
    }
  }, [vendor, show]);

  const resetForm = () => {
    setFormData({
      name: '',
      companyName: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan',
      taxId: '',
      website: '',
      type: 'Supplier',
      paymentTerms: 'Net30',
      creditLimit: '0',
      notes: ''
    });
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Vendor name is required';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }

    const creditLimit = parseFloat(formData.creditLimit);
    if (isNaN(creditLimit) || creditLimit < 0) {
      errors.creditLimit = 'Valid credit limit is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const vendorData = {
      name: formData.name.trim(),
      companyName: formData.companyName.trim(),
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      country: formData.country.trim(),
      taxId: formData.taxId.trim() || undefined,
      website: formData.website.trim() || undefined,
      type: formData.type,
      paymentTerms: formData.paymentTerms,
      creditLimit: parseFloat(formData.creditLimit),
      notes: formData.notes.trim() || undefined
    };

    onSave(vendorData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {vendor ? 'Edit Vendor' : 'Add New Vendor'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible>
              {error}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Vendor Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter vendor name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  isInvalid={!!validationErrors.name}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Company Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  isInvalid={!!validationErrors.companyName}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.companyName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Contact Person <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  isInvalid={!!validationErrors.contactPerson}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.contactPerson}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="vendor@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  isInvalid={!!validationErrors.email}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Phone Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+92-XXX-XXXXXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  isInvalid={!!validationErrors.phoneNumber}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Street address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={isLoading}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>State/Province</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ZIP"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tax ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tax ID"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  disabled={isLoading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Vendor Type</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="Supplier">Supplier</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Wholesaler">Wholesaler</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Terms</Form.Label>
                <Form.Select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Net15">Net 15 Days</option>
                  <option value="Net30">Net 30 Days</option>
                  <option value="Net45">Net 45 Days</option>
                  <option value="Net60">Net 60 Days</option>
                  <option value="Net90">Net 90 Days</option>
                  <option value="PrepaidOnly">Prepaid Only</option>
                  <option value="TwoTenNet30">2/10 Net 30</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Credit Limit</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  isInvalid={!!validationErrors.creditLimit}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.creditLimit}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Additional notes about the vendor"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isLoading}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              vendor ? 'Update Vendor' : 'Create Vendor'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default VendorModal;
