import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FaBarcode, FaPlus, FaExchangeAlt, FaTools, FaTrash, FaShieldAlt, FaClock } from 'react-icons/fa';
import serialNumbersService, { SerialNumber, CreateSerialNumberRequest } from '../../services/serialNumbersService';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/dateUtils';

const SerialNumbers: React.FC = () => {
  const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>([]);
  const [selectedSerial, setSelectedSerial] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'transfer' | 'defective' | 'repair' | null>(null);
  const [formData, setFormData] = useState<CreateSerialNumberRequest>({
    number: '',
    productId: '',
    warrantyMonths: 12,
  });
  const [actionData, setActionData] = useState<any>({});
  const [filter, setFilter] = useState({ status: '', productId: '', customerId: '' });

  useEffect(() => {
    loadSerialNumbers();
  }, [filter]);

  const loadSerialNumbers = async () => {
    try {
      setLoading(true);
      const data = await serialNumbersService.getAll(filter);
      setSerialNumbers(data);
    } catch (err: any) {
      toast.error('Failed to load serial numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await serialNumbersService.create(formData);
      toast.success('Serial number created successfully');
      setShowCreateModal(false);
      setFormData({
        number: '',
        productId: '',
        warrantyMonths: 12,
      });
      loadSerialNumbers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create serial number');
    }
  };

  const handleViewDetails = async (serial: SerialNumber) => {
    try {
      const details = await serialNumbersService.getById(serial.id);
      setSelectedSerial(details);
      setShowDetailsModal(true);
    } catch (err: any) {
      toast.error('Failed to load serial number details');
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSerial || !actionType) return;

    try {
      switch (actionType) {
        case 'transfer':
          await serialNumbersService.transfer(selectedSerial.id, actionData.toLocationId, actionData.reason);
          toast.success('Serial number transferred');
          break;
        case 'defective':
          await serialNumbersService.markDefective(selectedSerial.id, actionData.reason);
          toast.warning('Serial number marked as defective');
          break;
        case 'repair':
          await serialNumbersService.repair(selectedSerial.id, actionData.notes);
          toast.success('Serial number repaired');
          break;
      }
      setShowActionModal(false);
      setSelectedSerial(null);
      setActionType(null);
      setActionData({});
      loadSerialNumbers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const openActionModal = (serial: SerialNumber, action: typeof actionType) => {
    setSelectedSerial(serial);
    setActionType(action);
    setShowActionModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Available': 'success',
      'Sold': 'primary',
      'Returned': 'warning',
      'Defective': 'danger',
      'Disposed': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getWarrantyBadge = (serial: SerialNumber) => {
    if (!serial.isUnderWarranty) {
      return <Badge bg="secondary">No Warranty</Badge>;
    }
    if (serial.daysRemainingInWarranty <= 30) {
      return <Badge bg="warning"><FaClock className="me-1" />{serial.daysRemainingInWarranty} days</Badge>;
    }
    return <Badge bg="success"><FaShieldAlt className="me-1" />{serial.daysRemainingInWarranty} days</Badge>;
  };

  return (
    <div className="serial-numbers">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaBarcode className="me-2" />Serial Number Tracking</h2>
          <p className="text-muted">Track individual items with serial numbers and warranties</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" />Add Serial Number
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Returned">Returned</option>
                  <option value="Defective">Defective</option>
                  <option value="Disposed">Disposed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  type="text"
                  value={filter.productId}
                  onChange={(e) => setFilter({ ...filter, productId: e.target.value })}
                  placeholder="Filter by product..."
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Customer ID</Form.Label>
                <Form.Control
                  type="text"
                  value={filter.customerId}
                  onChange={(e) => setFilter({ ...filter, customerId: e.target.value })}
                  placeholder="Filter by customer..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Serial Numbers Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : serialNumbers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaBarcode size={48} className="mb-3 opacity-25" />
              <p>No serial numbers found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Batch</th>
                  <th>Warranty</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {serialNumbers.map((serial) => (
                  <tr key={serial.id}>
                    <td>
                      <code className="font-monospace">{serial.number}</code>
                    </td>
                    <td>
                      <strong>{serial.productName}</strong>
                    </td>
                    <td>{getStatusBadge(serial.status)}</td>
                    <td>
                      {serial.customerName ? (
                        <div>
                          <small>{serial.customerName}</small>
                          {serial.soldDate && (
                            <>
                              <br />
                              <small className="text-muted">Sold: {formatDate(serial.soldDate)}</small>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {serial.locationName ? (
                        <Badge bg="info">{serial.locationName}</Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {serial.batchNumber ? (
                        <Badge bg="secondary">{serial.batchNumber}</Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>{getWarrantyBadge(serial)}</td>
                    <td>
                      <small>{formatDate(serial.createdAt)}</small>
                      <br />
                      <small className="text-muted">{serial.createdBy}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => handleViewDetails(serial)}
                        >
                          View
                        </Button>
                        {(serial.status === 'Available' || serial.status === 'Sold') && (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => openActionModal(serial, 'transfer')}
                          >
                            <FaExchangeAlt />
                          </Button>
                        )}
                        {serial.status === 'Available' && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => openActionModal(serial, 'defective')}
                          >
                            <FaTrash />
                          </Button>
                        )}
                        {serial.status === 'Defective' && (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => openActionModal(serial, 'repair')}
                          >
                            <FaTools />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Serial Number Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Serial Number</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSerial}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Serial Number *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="SN-ABC123XYZ"
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
                  <Form.Label>Batch ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.batchId || ''}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    placeholder="Optional batch ID"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.locationId || ''}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    placeholder="Optional location"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Warranty Period (Months)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: parseInt(e.target.value) })}
              />
              <Form.Text>Enter 0 for no warranty</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Serial Number</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBarcode className="me-2" />
            Serial Number Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSerial && (
            <Tabs defaultActiveKey="info" className="mb-3">
              <Tab eventKey="info" title="Information">
                <Row>
                  <Col md={6}>
                    <h6>Serial Number</h6>
                    <p className="font-monospace">{selectedSerial.number}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Status</h6>
                    <p>{getStatusBadge(selectedSerial.status)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Product</h6>
                    <p>{selectedSerial.productName}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Batch</h6>
                    <p>{selectedSerial.batchNumber || '-'}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Location</h6>
                    <p>{selectedSerial.locationName || '-'}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Created By</h6>
                    <p>{selectedSerial.createdBy}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Customer</h6>
                    <p>{selectedSerial.customerName || '-'}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Sold Date</h6>
                    <p>{selectedSerial.soldDate ? formatDate(selectedSerial.soldDate) : '-'}</p>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="warranty" title="Warranty">
                <Row>
                  <Col md={4}>
                    <h6>Warranty Period</h6>
                    <p>{selectedSerial.warrantyMonths} months</p>
                  </Col>
                  <Col md={4}>
                    <h6>Start Date</h6>
                    <p>{selectedSerial.warrantyStartDate ? formatDate(selectedSerial.warrantyStartDate) : '-'}</p>
                  </Col>
                  <Col md={4}>
                    <h6>End Date</h6>
                    <p>{selectedSerial.warrantyEndDate ? formatDate(selectedSerial.warrantyEndDate) : '-'}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Under Warranty</h6>
                    <p>{getWarrantyBadge(selectedSerial)}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Days Remaining</h6>
                    <p>{selectedSerial.daysRemainingInWarranty} days</p>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="history" title="History">
                {selectedSerial.history && selectedSerial.history.length > 0 ? (
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>User</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSerial.history.map((entry: any, index: number) => (
                        <tr key={index}>
                          <td><small>{formatDate(entry.actionDate)}</small></td>
                          <td>
                            <Badge bg="secondary">{entry.action}</Badge>
                          </td>
                          <td><small>{entry.actionBy}</small></td>
                          <td><small>{entry.notes || '-'}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No history available</p>
                )}
              </Tab>
            </Tabs>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Action Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'transfer' && 'Transfer Serial Number'}
            {actionType === 'defective' && 'Mark as Defective'}
            {actionType === 'repair' && 'Repair Serial Number'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAction}>
          <Modal.Body>
            {actionType === 'transfer' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>To Location ID *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={actionData.toLocationId || ''}
                    onChange={(e) => setActionData({ ...actionData, toLocationId: e.target.value })}
                    placeholder="Destination location UUID"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={actionData.reason || ''}
                    onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                    placeholder="Transfer reason..."
                  />
                </Form.Group>
              </>
            )}

            {actionType === 'defective' && (
              <Form.Group className="mb-3">
                <Form.Label>Defect Reason *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={actionData.reason || ''}
                  onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                  placeholder="Describe the defect..."
                />
              </Form.Group>
            )}

            {actionType === 'repair' && (
              <Form.Group className="mb-3">
                <Form.Label>Repair Notes *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={actionData.notes || ''}
                  onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                  placeholder="Describe the repair work..."
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowActionModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default SerialNumbers;
