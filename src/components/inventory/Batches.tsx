import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaBoxes, FaPlus, FaExclamationTriangle, FaBan, FaClock } from 'react-icons/fa';
import batchesService, { Batch, CreateBatchRequest } from '../../services/batchesService';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/dateUtils';
import { getErrorMessage } from '../../types/api';

const Batches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState<CreateBatchRequest>({
    batchNumber: '',
    productId: '',
    initialQuantity: 0,
    unitCost: 0,
  });
  const [recallReason, setRecallReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'recalled'>('all');

  useEffect(() => {
    loadBatches();
  }, [filter]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      let data: Batch[];
      if (filter === 'expiring') {
        data = await batchesService.getExpiring(30);
      } else if (filter === 'recalled') {
        data = await batchesService.getAll({ recalled: true });
      } else if (filter === 'active') {
        data = await batchesService.getAll({ status: 'Active' });
      } else {
        data = await batchesService.getAll();
      }
      setBatches(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await batchesService.create(formData);
      toast.success('Batch created successfully');
      setShowCreateModal(false);
      setFormData({
        batchNumber: '',
        productId: '',
        initialQuantity: 0,
        unitCost: 0,
      });
      loadBatches();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    try {
      const result = await batchesService.recall(selectedBatch.id, recallReason);
      toast.warning(`Batch recalled. ${result.affectedQuantity} units affected.`);
      setShowRecallModal(false);
      setSelectedBatch(null);
      setRecallReason('');
      loadBatches();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openRecallModal = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowRecallModal(true);
  };

  const getStatusBadge = (batch: Batch) => {
    if (batch.isRecalled) {
      return <Badge bg="danger"><FaBan className="me-1" />Recalled</Badge>;
    }
    if (batch.status === 'Expired') {
      return <Badge bg="dark">Expired</Badge>;
    }
    if (batch.isExpiringSoon) {
      return <Badge bg="warning"><FaClock className="me-1" />Expiring Soon</Badge>;
    }
    if (batch.status === 'Depleted') {
      return <Badge bg="secondary">Depleted</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  const getDaysUntilExpiryColor = (days: number) => {
    if (days < 0) return 'danger';
    if (days <= 7) return 'danger';
    if (days <= 30) return 'warning';
    return 'success';
  };

  return (
    <div className="batches">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaBoxes className="me-2" />Batch/Lot Management</h2>
          <p className="text-muted">Track inventory batches and expiry dates</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" />Create Batch
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-3">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline-primary'}
          className="me-2"
          onClick={() => setFilter('all')}
        >
          All Batches
        </Button>
        <Button
          variant={filter === 'active' ? 'success' : 'outline-success'}
          className="me-2"
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'expiring' ? 'warning' : 'outline-warning'}
          className="me-2"
          onClick={() => setFilter('expiring')}
        >
          <FaExclamationTriangle className="me-1" />Expiring Soon
        </Button>
        <Button
          variant={filter === 'recalled' ? 'danger' : 'outline-danger'}
          onClick={() => setFilter('recalled')}
        >
          <FaBan className="me-1" />Recalled
        </Button>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaBoxes size={48} className="mb-3 opacity-25" />
              <p>No batches found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Batch #</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Received</th>
                  <th>Expiry</th>
                  <th>Days Left</th>
                  <th>Unit Cost</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id}>
                    <td>
                      <code>{batch.batchNumber}</code>
                    </td>
                    <td>
                      <strong>{batch.productName}</strong>
                      <br />
                      <small className="text-muted">{batch.productSKU}</small>
                    </td>
                    <td>
                      <div>{batch.currentQuantity} / {batch.initialQuantity}</div>
                      {batch.currentQuantity < batch.initialQuantity && (
                        <small className="text-muted">
                          ({((batch.currentQuantity / batch.initialQuantity) * 100).toFixed(0)}% remaining)
                        </small>
                      )}
                    </td>
                    <td>
                      <small>{formatDate(batch.receivedDate)}</small>
                      {batch.vendorName && (
                        <>
                          <br />
                          <small className="text-muted">{batch.vendorName}</small>
                        </>
                      )}
                    </td>
                    <td>
                      {batch.expiryDate ? (
                        <small>{formatDate(batch.expiryDate)}</small>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {batch.expiryDate && batch.daysUntilExpiry < 999 ? (
                        <Badge bg={getDaysUntilExpiryColor(batch.daysUntilExpiry)}>
                          {batch.daysUntilExpiry > 0
                            ? `${batch.daysUntilExpiry} days`
                            : batch.isExpired ? 'Expired' : 'Today'
                          }
                        </Badge>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>${batch.unitCost.toFixed(2)}</td>
                    <td>
                      <strong>${batch.totalValue.toFixed(2)}</strong>
                    </td>
                    <td>{getStatusBadge(batch)}</td>
                    <td>
                      {batch.status === 'Active' && !batch.isRecalled && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => openRecallModal(batch)}
                        >
                          <FaBan /> Recall
                        </Button>
                      )}
                      {batch.isRecalled && batch.recallReason && (
                        <div>
                          <small className="text-danger">{batch.recallReason}</small>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Batch Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Batch</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateBatch}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Batch Number *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    placeholder="LOT-2025-001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    placeholder="Product UUID"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Initial Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="1"
                    value={formData.initialQuantity}
                    onChange={(e) => setFormData({ ...formData, initialQuantity: parseInt(e.target.value) })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit Cost *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Manufacture Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.manufactureDate || ''}
                    onChange={(e) => setFormData({ ...formData, manufactureDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Vendor ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.vendorId || ''}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Batch</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Recall Batch Modal */}
      <Modal show={showRecallModal} onHide={() => setShowRecallModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaBan className="me-2" />Recall Batch
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRecall}>
          <Modal.Body>
            <Alert variant="warning">
              <strong>Warning:</strong> This action will mark the entire batch as recalled and prevent further use.
              Current quantity: <strong>{selectedBatch?.currentQuantity}</strong> units
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Recall Reason *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                required
                value={recallReason}
                onChange={(e) => setRecallReason(e.target.value)}
                placeholder="Describe the reason for recalling this batch..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRecallModal(false)}>Cancel</Button>
            <Button variant="danger" type="submit">
              <FaBan className="me-2" />Confirm Recall
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Batches;
