import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaBox } from 'react-icons/fa';
import locationsService, { Location, CreateLocationRequest, UpdateLocationRequest } from '../../services/locationsService';
import { toast } from 'react-toastify';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<CreateLocationRequest>({
    name: '',
    code: '',
    type: 'Warehouse',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await locationsService.getAll(undefined, true);
      setLocations(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        code: location.code,
        type: location.type,
        address: location.address || '',
        city: location.city || '',
        state: location.state || '',
        zipCode: location.zipCode || '',
        notes: location.notes || ''
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: '',
        code: '',
        type: 'Warehouse',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await locationsService.update(editingLocation.id, formData as UpdateLocationRequest);
        toast.success('Location updated successfully');
      } else {
        await locationsService.create(formData);
        toast.success('Location created successfully');
      }
      handleCloseModal();
      loadLocations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save location');
    }
  };

  const handleToggleActive = async (location: Location) => {
    try {
      if (location.isActive) {
        await locationsService.deactivate(location.id);
        toast.success('Location deactivated');
      } else {
        await locationsService.activate(location.id);
        toast.success('Location activated');
      }
      loadLocations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update location');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Store': 'primary',
      'Warehouse': 'success',
      'Backroom': 'info',
      'Display': 'warning',
      'Shelf': 'secondary',
      'Bin': 'dark'
    };
    return colors[type] || 'secondary';
  };

  return (
    <div className="locations">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaMapMarkerAlt className="me-2" />Locations</h2>
          <p className="text-muted">Manage warehouses, stores, and storage locations</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" />Add Location
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaMapMarkerAlt size={48} className="mb-3 opacity-25" />
              <p>No locations found</p>
              <Button variant="primary" onClick={() => handleShowModal()}>
                Create First Location
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Address</th>
                  <th>Products</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td>
                      <code>{location.code}</code>
                    </td>
                    <td>
                      <strong>{location.name}</strong>
                      {location.parentLocationName && (
                        <div>
                          <small className="text-muted">
                            Parent: {location.parentLocationName}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge bg={getTypeColor(location.type)}>{location.type}</Badge>
                    </td>
                    <td>
                      <small>{location.fullAddress || '-'}</small>
                    </td>
                    <td>
                      {location.productCount !== undefined ? (
                        <Badge bg="info">
                          <FaBox className="me-1" />
                          {location.productCount}
                        </Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {location.totalQuantity !== undefined ? (
                        <strong>{location.totalQuantity.toLocaleString()}</strong>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={location.isActive ? 'success' : 'secondary'}>
                        {location.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleShowModal(location)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant={location.isActive ? 'outline-warning' : 'outline-success'}
                          onClick={() => handleToggleActive(location)}
                        >
                          {location.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingLocation ? 'Edit Location' : 'Create Location'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Main Warehouse"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="WH-001"
                    disabled={!!editingLocation}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="Store">Store</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Backroom">Backroom</option>
                <option value="Display">Display</option>
                <option value="Shelf">Shelf</option>
                <option value="Bin">Bin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St"
              />
            </Form.Group>

            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NY"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="10001"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingLocation ? 'Update' : 'Create'} Location
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Locations;
