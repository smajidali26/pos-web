import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { sizesService, type Size } from '../../services/sizesService';
import SizeModal from './SizeModal';
import { getErrorMessage } from '../../types/api';

const Sizes: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [filteredSizes, setFilteredSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadSizes();
  }, []);

  useEffect(() => {
    filterSizes();
  }, [searchTerm, sizes]);

  const loadSizes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sizesService.getAll();
      setSizes(data);
      setFilteredSizes(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error loading sizes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSizes = () => {
    if (!searchTerm.trim()) {
      setFilteredSizes(sizes);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = sizes.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    );
    setFilteredSizes(filtered);
  };

  const handleCreate = async (sizeData: unknown) => {
    try {
      setModalLoading(true);
      setModalError(null);
      await sizesService.create(sizeData);
      await loadSizes();
      setShowModal(false);
      setSelectedSize(null);
    } catch (err) {
      setModalError(getErrorMessage(err));
      console.error('Error creating size:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (sizeData: unknown) => {
    if (!selectedSize) return;

    try {
      setModalLoading(true);
      setModalError(null);
      // Include the size ID in the request body
      const updateData = {
        id: selectedSize.id,
        ...sizeData
      };
      await sizesService.update(selectedSize.id, updateData);
      await loadSizes();
      setShowModal(false);
      setSelectedSize(null);
    } catch (err) {
      setModalError(getErrorMessage(err));
      console.error('Error updating size:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (size: Size) => {
    if (!window.confirm(`Are you sure you want to delete size "${size.name}"?\n\nNote: You cannot delete sizes that are being used by products.`)) {
      return;
    }

    try {
      setDeleteLoading(size.id);
      setError(null);
      await sizesService.delete(size.id);
      await loadSizes();
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error deleting size:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (size: Size) => {
    setSelectedSize(size);
    setModalError(null);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedSize(null);
    setModalError(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading sizes...</p>
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
                <i className="bi bi-rulers me-2"></i>
                Size Management
              </h2>
              <p className="text-muted mb-0">
                Manage product sizes and measurements
              </p>
            </div>
            <Button variant="primary" onClick={handleAddNew}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Size
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
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Size Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSizes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      {searchTerm ? 'No sizes found matching your search' : 'No sizes available'}
                    </td>
                  </tr>
                ) : (
                  filteredSizes.map((size) => (
                    <tr key={size.id}>
                      <td className="fw-bold">{size.name}</td>
                      <td>
                        <small>{size.description || <span className="text-muted">No description</span>}</small>
                      </td>
                      <td>
                        <Badge bg={size.isActive ? 'success' : 'secondary'}>
                          {size.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <small>{new Date(size.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(size)}
                            title="Edit size"
                            disabled={deleteLoading === size.id}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(size)}
                            title="Delete size"
                            disabled={deleteLoading !== null}
                          >
                            {deleteLoading === size.id ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {filteredSizes.length > 0 && (
            <div className="mt-3 text-muted">
              <small>
                Showing {filteredSizes.length} of {sizes.length} size(s)
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      <SizeModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSize(null);
          setModalError(null);
        }}
        onSave={selectedSize ? handleUpdate : handleCreate}
        size={selectedSize}
        isLoading={modalLoading}
        error={modalError}
      />
    </Container>
  );
};

export default Sizes;
