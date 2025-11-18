import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup } from 'react-bootstrap';
import { useInterStoreTransfers } from '../../hooks/useInterStoreTransfers';
import { useStores } from '../../hooks/useStores';
import { CreateTransferModal } from './CreateTransferModal';
import { TransferDetailsModal } from './TransferDetailsModal';
import { InterStoreTransfer, TransferStatus } from '../../types/interStoreTransfer';
import Pagination from '../common/Pagination';
import { formatCurrency } from '../../utils/currency';

export const InterStoreTransfers: React.FC = () => {
  const {
    transfers,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    fetchTransfers,
    clearErrorMessage,
    changePage
  } = useInterStoreTransfers();

  const { stores, fetchStores } = useStores();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<InterStoreTransfer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | TransferStatus>('all');
  const [filterStore, setFilterStore] = useState('');

  useEffect(() => {
    if (transfers.length === 0 && !isLoading) {
      fetchTransfers();
    }
    if (stores.length === 0) {
      fetchStores({ pageSize: 1000 });
    }
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => clearErrorMessage(), 5000);
    }
  }, [error, clearErrorMessage]);

  const handleCreateTransfer = () => {
    setShowCreateModal(true);
  };

  const handleViewTransfer = (transfer: InterStoreTransfer) => {
    setSelectedTransfer(transfer);
    setShowDetailsModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2 || value.length === 0) {
      const status = filterStatus === 'all' ? undefined : filterStatus;
      fetchTransfers({
        page: 1,
        pageSize,
        searchTerm: value || undefined,
        status,
        fromStoreId: filterStore || undefined,
        toStoreId: filterStore || undefined
      });
    }
  };

  const handleFilterStatusChange = (status: 'all' | TransferStatus) => {
    setFilterStatus(status);
    const statusValue = status === 'all' ? undefined : status;
    fetchTransfers({
      page: 1,
      pageSize,
      searchTerm: searchTerm || undefined,
      status: statusValue,
      fromStoreId: filterStore || undefined,
      toStoreId: filterStore || undefined
    });
  };

  const handleFilterStoreChange = (storeId: string) => {
    setFilterStore(storeId);
    const status = filterStatus === 'all' ? undefined : filterStatus;
    fetchTransfers({
      page: 1,
      pageSize,
      searchTerm: searchTerm || undefined,
      status,
      fromStoreId: storeId || undefined,
      toStoreId: storeId || undefined
    });
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

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

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Inter-Store Transfers</h2>
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
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search transfers..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => handleFilterStatusChange(e.target.value as 'all' | TransferStatus)}
                  >
                    <option value="all">All Status</option>
                    <option value={TransferStatus.DRAFT}>Draft</option>
                    <option value={TransferStatus.PENDING}>Pending</option>
                    <option value={TransferStatus.APPROVED}>Approved</option>
                    <option value={TransferStatus.IN_TRANSIT}>In Transit</option>
                    <option value={TransferStatus.COMPLETED}>Completed</option>
                    <option value={TransferStatus.REJECTED}>Rejected</option>
                    <option value={TransferStatus.CANCELLED}>Cancelled</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterStore}
                    onChange={(e) => handleFilterStoreChange(e.target.value)}
                  >
                    <option value="">All Stores</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4} className="text-end">
                  <Button variant="primary" onClick={handleCreateTransfer}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Create Transfer
                  </Button>
                </Col>
              </Row>
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
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : transfers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No transfers found
                      </td>
                    </tr>
                  ) : (
                    transfers.map((transfer) => (
                      <tr key={transfer.id}>
                        <td>
                          <strong>{transfer.transferNumber}</strong>
                        </td>
                        <td>{transfer.fromStoreName}</td>
                        <td>{transfer.toStoreName}</td>
                        <td className="text-center">{transfer.totalItems}</td>
                        <td>{formatCurrency(transfer.totalValue)}</td>
                        <td>{getStatusBadge(transfer.status)}</td>
                        <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewTransfer(transfer)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showCreateModal && (
        <CreateTransferModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTransfers({ page: currentPage, pageSize });
          }}
        />
      )}

      {showDetailsModal && selectedTransfer && (
        <TransferDetailsModal
          show={showDetailsModal}
          transfer={selectedTransfer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransfer(null);
          }}
          onUpdate={() => {
            fetchTransfers({ page: currentPage, pageSize });
          }}
        />
      )}
    </Container>
  );
};

export default InterStoreTransfers;
