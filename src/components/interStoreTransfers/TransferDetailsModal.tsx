import React, { useState } from 'react';
import { Modal, Button, Table, Badge, Form, Alert, Row, Col } from 'react-bootstrap';
import { useInterStoreTransfers } from '../../hooks/useInterStoreTransfers';
import { InterStoreTransfer, TransferStatus } from '../../types/interStoreTransfer';
import { formatCurrency } from '../../utils/currency';
import { TransferTimeline } from './TransferTimeline';

interface TransferDetailsModalProps {
  show: boolean;
  transfer: InterStoreTransfer;
  onClose: () => void;
  onUpdate: () => void;
}

export const TransferDetailsModal: React.FC<TransferDetailsModalProps> = ({
  show,
  transfer,
  onClose,
  onUpdate
}) => {
  const {
    submitTransfer,
    approveTransfer,
    rejectTransfer,
    shipTransfer,
    completeTransfer,
    cancelTransfer,
    isLoading,
    error
  } = useInterStoreTransfers();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const getStatusBadge = (status: TransferStatus) => {
    const variants: Record<TransferStatus, string> = {
      [TransferStatus.DRAFT]: 'secondary',
      [TransferStatus.PENDING]: 'warning',
      [TransferStatus.APPROVED]: 'info',
      [TransferStatus.IN_TRANSIT]: 'primary',
      [TransferStatus.COMPLETED]: 'success',
      [TransferStatus.REJECTED]: 'danger',
      [TransferStatus.CANCELLED]: 'dark'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const handleSubmit = () => {
    submitTransfer(transfer.id);
    setTimeout(() => onUpdate(), 500);
  };

  const handleApprove = () => {
    if (window.confirm('Are you sure you want to approve this transfer?')) {
      approveTransfer(transfer.id);
      setTimeout(() => onUpdate(), 500);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    rejectTransfer(transfer.id, rejectReason);
    setTimeout(() => {
      onUpdate();
      setShowRejectForm(false);
      setRejectReason('');
    }, 500);
  };

  const handleShip = () => {
    if (window.confirm('Mark this transfer as shipped?')) {
      shipTransfer(transfer.id);
      setTimeout(() => onUpdate(), 500);
    }
  };

  const handleComplete = () => {
    if (window.confirm('Mark this transfer as completed? This will update inventory.')) {
      completeTransfer(transfer.id);
      setTimeout(() => onUpdate(), 500);
    }
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    cancelTransfer(transfer.id, cancelReason);
    setTimeout(() => {
      onUpdate();
      setShowCancelForm(false);
      setCancelReason('');
    }, 500);
  };

  const canSubmit = transfer.status === TransferStatus.DRAFT;
  const canApprove = transfer.status === TransferStatus.PENDING;
  const canReject = transfer.status === TransferStatus.PENDING;
  const canShip = transfer.status === TransferStatus.APPROVED;
  const canComplete = transfer.status === TransferStatus.IN_TRANSIT;
  const canCancel = [TransferStatus.DRAFT, TransferStatus.PENDING, TransferStatus.APPROVED].includes(transfer.status);

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Transfer Details - {transfer.transferNumber}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Row className="mb-4">
          <Col md={6}>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="text-muted mb-3">Transfer Information</h6>
                <div className="mb-2">
                  <strong>Status:</strong> {getStatusBadge(transfer.status)}
                </div>
                <div className="mb-2">
                  <strong>From:</strong> {transfer.fromStoreName}
                </div>
                <div className="mb-2">
                  <strong>To:</strong> {transfer.toStoreName}
                </div>
                <div className="mb-2">
                  <strong>Created By:</strong> {transfer.createdByName}
                </div>
                <div className="mb-2">
                  <strong>Created Date:</strong> {new Date(transfer.createdAt).toLocaleString()}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h6 className="text-muted mb-3">Summary</h6>
                <div className="mb-2">
                  <strong>Total Items:</strong> {transfer.totalItems}
                </div>
                <div className="mb-2">
                  <strong>Total Quantity:</strong> {transfer.totalQuantity}
                </div>
                <div className="mb-2">
                  <strong>Total Value:</strong> {formatCurrency(transfer.totalValue)}
                </div>
                {transfer.approvedByName && (
                  <div className="mb-2">
                    <strong>Approved By:</strong> {transfer.approvedByName}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {transfer.notes && (
          <Alert variant="info" className="mb-4">
            <strong>Notes:</strong> {transfer.notes}
          </Alert>
        )}

        {transfer.rejectionReason && (
          <Alert variant="danger" className="mb-4">
            <strong>Rejection Reason:</strong> {transfer.rejectionReason}
          </Alert>
        )}

        {transfer.cancellationReason && (
          <Alert variant="warning" className="mb-4">
            <strong>Cancellation Reason:</strong> {transfer.cancellationReason}
          </Alert>
        )}

        <h5 className="mb-3">Transfer Items</h5>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Unit Price</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {transfer.items.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.sku}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                <td className="text-end">{formatCurrency(item.totalPrice)}</td>
              </tr>
            ))}
            <tr className="fw-bold">
              <td colSpan={2} className="text-end">Total:</td>
              <td className="text-end">{transfer.totalQuantity}</td>
              <td></td>
              <td className="text-end">{formatCurrency(transfer.totalValue)}</td>
            </tr>
          </tbody>
        </Table>

        <TransferTimeline transferId={transfer.id} />

        {showRejectForm && (
          <div className="mt-4">
            <Form.Group>
              <Form.Label>Rejection Reason <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this transfer..."
              />
            </Form.Group>
          </div>
        )}

        {showCancelForm && (
          <div className="mt-4">
            <Form.Group>
              <Form.Label>Cancellation Reason <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this transfer..."
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <div>
          {canSubmit && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              className="me-2"
            >
              Submit for Approval
            </Button>
          )}
          {canApprove && !showRejectForm && (
            <>
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={isLoading}
                className="me-2"
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectForm(true)}
                disabled={isLoading}
                className="me-2"
              >
                Reject
              </Button>
            </>
          )}
          {showRejectForm && (
            <>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={isLoading}
                className="me-2"
              >
                Confirm Rejection
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason('');
                }}
                className="me-2"
              >
                Cancel Rejection
              </Button>
            </>
          )}
          {canShip && (
            <Button
              variant="primary"
              onClick={handleShip}
              disabled={isLoading}
              className="me-2"
            >
              Mark as Shipped
            </Button>
          )}
          {canComplete && (
            <Button
              variant="success"
              onClick={handleComplete}
              disabled={isLoading}
              className="me-2"
            >
              Complete Transfer
            </Button>
          )}
          {canCancel && !showCancelForm && !showRejectForm && (
            <Button
              variant="warning"
              onClick={() => setShowCancelForm(true)}
              disabled={isLoading}
            >
              Cancel Transfer
            </Button>
          )}
          {showCancelForm && (
            <>
              <Button
                variant="warning"
                onClick={handleCancel}
                disabled={isLoading}
                className="me-2"
              >
                Confirm Cancellation
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCancelForm(false);
                  setCancelReason('');
                }}
              >
                Cancel Action
              </Button>
            </>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TransferDetailsModal;
