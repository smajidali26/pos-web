import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { vendorsService, type Vendor } from '../../services/vendorsService';
import VendorModal from './VendorModal';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);

  useEffect(() => {
    loadVendors();
  }, [includeInactive]);

  useEffect(() => {
    filterVendors();
  }, [searchTerm, vendors]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorsService.getAll(includeInactive);
      setVendors(data);
      setFilteredVendors(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vendors');
      console.error('Error loading vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    if (!searchTerm.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = vendors.filter(v =>
      v.name.toLowerCase().includes(term) ||
      v.companyName.toLowerCase().includes(term) ||
      v.contactPerson.toLowerCase().includes(term) ||
      v.email.toLowerCase().includes(term)
    );
    setFilteredVendors(filtered);
  };

  const handleCreate = async (vendorData: any) => {
    try {
      setModalLoading(true);
      setModalError(null);
      await vendorsService.create(vendorData);
      await loadVendors();
      setShowModal(false);
      setSelectedVendor(null);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to create vendor');
      console.error('Error creating vendor:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (vendorData: any) => {
    if (!selectedVendor) return;

    try {
      setModalLoading(true);
      setModalError(null);
      // Include the vendor ID in the request body
      const updateData = {
        id: selectedVendor.id,
        ...vendorData
      };
      await vendorsService.update(selectedVendor.id, updateData);
      await loadVendors();
      setShowModal(false);
      setSelectedVendor(null);
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to update vendor');
      console.error('Error updating vendor:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (vendor: Vendor) => {
    try {
      if (vendor.isActive) {
        await vendorsService.deactivate(vendor.id);
      } else {
        await vendorsService.activate(vendor.id);
      }
      await loadVendors();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update vendor status');
      console.error('Error toggling vendor status:', err);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setModalError(null);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setModalError(null);
    setShowModal(true);
  };

  const getTypeBadgeVariant = (type: string) => {
    const variants: Record<string, string> = {
      'Supplier': 'primary',
      'Manufacturer': 'success',
      'Distributor': 'info',
      'Wholesaler': 'warning'
    };
    return variants[type] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading vendors...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="bi bi-building me-2"></i>
                Vendors Management
              </h2>
              <p className="text-muted mb-0">
                Manage your suppliers and vendors
              </p>
            </div>
            <Button variant="primary" onClick={handleAddNew}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Vendor
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name, company, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          <Form.Check
            type="checkbox"
            label="Include inactive vendors"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
          />
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Company</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Payment Terms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      {searchTerm ? 'No vendors found matching your search' : 'No vendors available'}
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td className="fw-bold">{vendor.name}</td>
                      <td>{vendor.companyName}</td>
                      <td>{vendor.contactPerson}</td>
                      <td>
                        <small>{vendor.email}</small>
                      </td>
                      <td>
                        <small>{vendor.phoneNumber}</small>
                      </td>
                      <td>
                        <Badge bg={getTypeBadgeVariant(vendor.typeName)}>
                          {vendor.typeName}
                        </Badge>
                      </td>
                      <td>
                        <small>{vendor.paymentTermsName}</small>
                      </td>
                      <td>
                        <Badge bg={vendor.isActive ? 'success' : 'secondary'}>
                          {vendor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(vendor)}
                            title="Edit vendor"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant={vendor.isActive ? 'outline-danger' : 'outline-success'}
                            size="sm"
                            onClick={() => handleToggleStatus(vendor)}
                            title={vendor.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`bi bi-${vendor.isActive ? 'x-circle' : 'check-circle'}`}></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {filteredVendors.length > 0 && (
            <div className="mt-3 text-muted">
              <small>
                Showing {filteredVendors.length} of {vendors.length} vendor(s)
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      <VendorModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVendor(null);
          setModalError(null);
        }}
        onSave={selectedVendor ? handleUpdate : handleCreate}
        vendor={selectedVendor}
        isLoading={modalLoading}
        error={modalError}
      />
    </Container>
  );
};

export default Vendors;
