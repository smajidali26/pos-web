import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col, ProgressBar } from 'react-bootstrap';
import { FaExchangeAlt, FaPlus, FaCheck, FaTimes, FaTruck, FaBoxOpen } from 'react-icons/fa';
import stockTransfersService, { StockTransfer, CreateStockTransferRequest } from '../../services/stockTransfersService';
import locationsService, { Location } from '../../services/locationsService';
import productsService from '../../services/productsService';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/dateUtils';
import { getErrorMessage } from '../../types/api';

const StockTransfers: React.FC = () => {
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'ship' | 'receive' | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transfersData, locationsData] = await Promise.all([
        stockTransfersService.getAll(),
        locationsService.getAll()
      ]);
      setTransfers(transfersData);
      setLocations(locationsData.filter(l => l.isActive));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await stockTransfersService.create(formData as CreateStockTransferRequest);
      toast.success('Transfer request created successfully');
      setShowCreateModal(false);
      setFormData({});
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransfer || !actionType) return;

    try {
      switch (actionType) {
        case 'approve':
          await stockTransfersService.approve(selectedTransfer.id);
          toast.success('Transfer approved');
          break;
        case 'reject':
          await stockTransfersService.reject(selectedTransfer.id, formData.reason);
          toast.success('Transfer rejected');
          break;
        case 'ship':
          await stockTransfersService.ship(
            selectedTransfer.id,
            formData.shippedQuantity,
            formData.trackingNumber,
            formData.shippingCost
          );
          toast.success('Transfer shipped');
          break;
        case 'receive':
          const result = await stockTransfersService.receive(
            selectedTransfer.id,
            formData.receivedQuantity,
            formData.receiverNotes
          );
          if (result.hasVariance) {
            toast.warning(`Transfer received with variance: ${result.variance} units`);
          } else {
            toast.success('Transfer received successfully');
          }
          break;
      }
      setShowActionModal(false);
      setSelectedTransfer(null);
      setActionType(null);
      setFormData({});
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openActionModal = (transfer: StockTransfer, action: typeof actionType) => {
    setSelectedTransfer(transfer);
    setActionType(action);
    setFormData(action === 'ship' ? { shippedQuantity: transfer.requestedQuantity } :
                 action === 'receive' ? { receivedQuantity: transfer.shippedQuantity } : {});
    setShowActionModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Pending': 'warning',
      'Approved': 'info',
      'Rejected': 'danger',
      'InTransit': 'primary',
      'Received': 'success',
      'Completed': 'success',
      'Cancelled': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getProgressPercentage = (status: string) => {
    const progress: Record<string, number> = {
      'Pending': 20,
      'Approved': 40,
      'InTransit': 60,
      'Received': 80,
      'Completed': 100,
      'Rejected': 0,
      'Cancelled': 0
    };
    return progress[status] || 0;
  };

  return (
    <div className="stock-transfers">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaExchangeAlt className="me-2" />Stock Transfers</h2>
          <p className="text-muted">Manage inter-location inventory transfers</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" />New Transfer
        </Button>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaExchangeAlt size={48} className="mb-3 opacity-25" />
              <p>No transfers found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Transfer #</th>
                  <th>Product</th>
                  <th>From → To</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Requested</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td><code>{transfer.transferNumber}</code></td>
                    <td>
                      <strong>{transfer.productName}</strong>
                      <br />
                      <small className="text-muted">{transfer.productSKU}</small>
                    </td>
                    <td>
                      <Badge bg="secondary">{transfer.fromLocationName}</Badge>
                      {' → '}
                      <Badge bg="info">{transfer.toLocationName}</Badge>
                    </td>
                    <td>
                      <div>
                        Requested: <strong>{transfer.requestedQuantity}</strong>
                      </div>
                      {transfer.shippedQuantity > 0 && (
                        <div>Shipped: {transfer.shippedQuantity}</div>
                      )}
                      {transfer.receivedQuantity > 0 && (
                        <div>Received: {transfer.receivedQuantity}</div>
                      )}
                      {transfer.hasVariance && (
                        <Badge bg="warning">Variance: {transfer.variance}</Badge>
                      )}
                    </td>
                    <td>{getStatusBadge(transfer.status)}</td>
                    <td style={{ minWidth: '150px' }}>
                      <ProgressBar
                        now={getProgressPercentage(transfer.status)}
                        variant={transfer.status === 'Completed' ? 'success' : 'primary'}
                        label={`${getProgressPercentage(transfer.status)}%`}
                      />
                    </td>
                    <td>
                      <small>{formatDate(transfer.requestedDate)}</small>
                      <br />
                      <small className="text-muted">by {transfer.requestedBy}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {transfer.status === 'Pending' && (
                          <>
                            <Button size="sm" variant="success" onClick={() => openActionModal(transfer, 'approve')}>
                              <FaCheck /> Approve
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => openActionModal(transfer, 'reject')}>
                              <FaTimes /> Reject
                            </Button>
                          </>
                        )}
                        {transfer.status === 'Approved' && (
                          <Button size="sm" variant="primary" onClick={() => openActionModal(transfer, 'ship')}>
                            <FaTruck /> Ship
                          </Button>
                        )}
                        {transfer.status === 'InTransit' && (
                          <Button size="sm" variant="success" onClick={() => openActionModal(transfer, 'receive')}>
                            <FaBoxOpen /> Receive
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

      {/* Create Transfer Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Stock Transfer</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTransfer}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>From Location *</Form.Label>
              <Form.Select
                required
                value={formData.fromLocationId || ''}
                onChange={(e) => setFormData({ ...formData, fromLocationId: e.target.value })}
              >
                <option value="">Select location...</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name} ({loc.code})</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>To Location *</Form.Label>
              <Form.Select
                required
                value={formData.toLocationId || ''}
                onChange={(e) => setFormData({ ...formData, toLocationId: e.target.value })}
              >
                <option value="">Select location...</option>
                {locations.filter(l => l.id !== formData.fromLocationId).map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name} ({loc.code})</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product ID *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.productId || ''}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                placeholder="Enter product ID or search..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity *</Form.Label>
              <Form.Control
                type="number"
                required
                min="1"
                value={formData.requestedQuantity || ''}
                onChange={(e) => setFormData({ ...formData, requestedQuantity: parseInt(e.target.value) })}
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
            <Button variant="primary" type="submit">Create Transfer</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Action Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'approve' && 'Approve Transfer'}
            {actionType === 'reject' && 'Reject Transfer'}
            {actionType === 'ship' && 'Ship Transfer'}
            {actionType === 'receive' && 'Receive Transfer'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAction}>
          <Modal.Body>
            {actionType === 'reject' && (
              <Form.Group className="mb-3">
                <Form.Label>Rejection Reason *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </Form.Group>
            )}
            {actionType === 'ship' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Shipped Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="1"
                    max={selectedTransfer?.requestedQuantity}
                    value={formData.shippedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, shippedQuantity: parseInt(e.target.value) })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tracking Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.trackingNumber || ''}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Shipping Cost</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.shippingCost || ''}
                    onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) })}
                  />
                </Form.Group>
              </>
            )}
            {actionType === 'receive' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Received Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="1"
                    max={selectedTransfer?.shippedQuantity}
                    value={formData.receivedQuantity || ''}
                    onChange={(e) => setFormData({ ...formData, receivedQuantity: parseInt(e.target.value) })}
                  />
                  <Form.Text>Shipped: {selectedTransfer?.shippedQuantity}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Receiver Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.receiverNotes || ''}
                    onChange={(e) => setFormData({ ...formData, receiverNotes: e.target.value })}
                  />
                </Form.Group>
              </>
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

export default StockTransfers;
