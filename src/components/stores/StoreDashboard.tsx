import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useStores } from '../../hooks/useStores';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import { TransferStatus } from '../../types/interStoreTransfer';

export const StoreDashboard: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { storeSummary, isLoading, error, fetchStoreSummary } = useStores();

  useEffect(() => {
    if (storeId) {
      fetchStoreSummary(storeId);
    }
  }, [storeId, fetchStoreSummary]);

  const getTransferStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      [TransferStatus.DRAFT]: 'secondary',
      [TransferStatus.PENDING]: 'warning',
      [TransferStatus.APPROVED]: 'info',
      [TransferStatus.IN_TRANSIT]: 'primary',
      [TransferStatus.COMPLETED]: 'success',
      [TransferStatus.REJECTED]: 'danger',
      [TransferStatus.CANCELLED]: 'dark'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Store Dashboard</h2>
              {storeSummary && (
                <p className="text-muted mb-0">{storeSummary.storeName}</p>
              )}
            </div>
            <div>
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => navigate(`/stores/${storeId}/inventory`)}
              >
                <i className="bi bi-box-seam me-1"></i>
                View Inventory
              </Button>
              <Button variant="outline-primary" onClick={() => navigate('/stores')}>
                <i className="bi bi-arrow-left me-1"></i>
                Back to Stores
              </Button>
            </div>
          </div>
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

      {isLoading ? (
        <Row>
          <Col className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        </Row>
      ) : storeSummary ? (
        <>
          <Row className="mb-3">
            <Col md={3}>
              <Card className="text-center border-primary">
                <Card.Body>
                  <h6 className="text-muted mb-2">
                    <i className="bi bi-box-seam me-1"></i>
                    Total Products
                  </h6>
                  <h3 className="mb-0 text-primary">{storeSummary.totalProducts}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success">
                <Card.Body>
                  <h6 className="text-muted mb-2">
                    <i className="bi bi-currency-dollar me-1"></i>
                    Inventory Value
                  </h6>
                  <h3 className="mb-0 text-success">
                    {formatCurrency(storeSummary.totalInventoryValue)}
                  </h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <h6 className="text-muted mb-2">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Low Stock Items
                  </h6>
                  <h3 className="mb-0 text-warning">{storeSummary.lowStockProducts}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-danger">
                <Card.Body>
                  <h6 className="text-muted mb-2">
                    <i className="bi bi-x-circle me-1"></i>
                    Out of Stock
                  </h6>
                  <h3 className="mb-0 text-danger">{storeSummary.outOfStockProducts}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Card className="text-center">
                <Card.Body>
                  <h6 className="text-muted mb-2">
                    <i className="bi bi-arrow-down-circle me-1"></i>
                    Pending Incoming Transfers
                  </h6>
                  <h3 className="mb-0">{storeSummary.pendingIncomingTransfers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center">
                <Card.Body>
                  <h6 className="text-muted mb-2">
                    <i className="bi bi-arrow-up-circle me-1"></i>
                    Pending Outgoing Transfers
                  </h6>
                  <h3 className="mb-0">{storeSummary.pendingOutgoingTransfers}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Top Products by Value
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="text-end">Quantity</th>
                        <th className="text-end">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeSummary.topProducts.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            No products available
                          </td>
                        </tr>
                      ) : (
                        storeSummary.topProducts.map((product) => (
                          <tr key={product.productId}>
                            <td>{product.productName}</td>
                            <td className="text-end">{product.quantity}</td>
                            <td className="text-end">{formatCurrency(product.value)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Recent Transfers
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>Transfer #</th>
                        <th>From/To</th>
                        <th>Items</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeSummary.recentTransfers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No recent transfers
                          </td>
                        </tr>
                      ) : (
                        storeSummary.recentTransfers.map((transfer) => (
                          <tr
                            key={transfer.transferId}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/transfers/${transfer.transferId}`)}
                          >
                            <td>{transfer.transferNumber}</td>
                            <td className="small">
                              {transfer.fromStoreName ? (
                                <>From: {transfer.fromStoreName}</>
                              ) : (
                                <>To: {transfer.toStoreName}</>
                              )}
                            </td>
                            <td>{transfer.itemCount}</td>
                            <td>{getTransferStatusBadge(transfer.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                  {storeSummary.recentTransfers.length > 0 && (
                    <div className="text-center mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate('/transfers')}
                      >
                        View All Transfers
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col className="text-center py-5 text-muted">
            No data available
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StoreDashboard;
