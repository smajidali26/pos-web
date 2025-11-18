import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useInterStoreTransfers } from '../../hooks/useInterStoreTransfers';
import { TransferDetailsModal } from './TransferDetailsModal';
import { InterStoreTransfer, TransferStatus } from '../../types/interStoreTransfer';
import { formatCurrency } from '../../utils/currency';

export const PendingTransfers: React.FC = () => {
  const {
    pendingTransfers,
    isLoading,
    error,
    fetchPendingTransfers,
    approveTransfer,
    rejectTransfer
  } = useInterStoreTransfers();

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<InterStoreTransfer | null>(null);

  useEffect(() => {
    fetchPendingTransfers();
  }, [fetchPendingTransfers]);

  const handleViewTransfer = (transfer: InterStoreTransfer) => {
    setSelectedTransfer(transfer);
    setShowDetailsModal(true);
  };

  const handleQuickApprove = (transfer: InterStoreTransfer) => {
    if (window.confirm(`Approve transfer ${transfer.transferNumber}?`)) {
      approveTransfer(transfer.id);
      setTimeout(() => fetchPendingTransfers(), 500);
    }
  };

  const handleQuickReject = (transfer: InterStoreTransfer) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
      rejectTransfer(transfer.id, reason);
      setTimeout(() => fetchPendingTransfers(), 500);
    }
  };

  const getStatusBadge = (status: TransferStatus) => {
    return <Badge bg="warning" text="dark">{status}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Pending Transfers</h2>
          <p className="text-muted">Transfers awaiting approval</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={12}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-warning">{pendingTransfers.length}</h3>
              <p className="text-muted mb-0">Pending Approvals</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Transfer #</th>
                    <th>From Store</th>
                    <th>To Store</th>
                    <th>Items</th>
                    <th>Total Value</th>
                    <th>Created By</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : pendingTransfers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No pending transfers
                      </td>
                    </tr>
                  ) : (
                    pendingTransfers.map((transfer) => (
                      <tr key={transfer.id}>
                        <td>
                          <strong>{transfer.transferNumber}</strong>
                        </td>
                        <td>{transfer.fromStoreName}</td>
                        <td>{transfer.toStoreName}</td>
                        <td className="text-center">{transfer.totalItems}</td>
                        <td>{formatCurrency(transfer.totalValue)}</td>
                        <td>{transfer.createdByName}</td>
                        <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                        <td>{getStatusBadge(transfer.status)}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleViewTransfer(transfer)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleQuickApprove(transfer)}
                            title="Quick Approve"
                          >
                            <i className="bi bi-check-circle"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleQuickReject(transfer)}
                            title="Quick Reject"
                          >
                            <i className="bi bi-x-circle"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showDetailsModal && selectedTransfer && (
        <TransferDetailsModal
          show={showDetailsModal}
          transfer={selectedTransfer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransfer(null);
          }}
          onUpdate={() => {
            fetchPendingTransfers();
          }}
        />
      )}
    </Container>
  );
};

export default PendingTransfers;
