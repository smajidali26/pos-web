import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup } from 'react-bootstrap';
import { useOrders } from '../../hooks/useOrders';
import { Order, OrderStatus, PaymentMethod } from '../../services/ordersService';
import { OrderReceipt } from './OrderReceipt';
import { NewOrderModal } from './NewOrderModal';
import { ReturnItemsModal } from './ReturnItemsModal';
import Pagination from '../common/Pagination';
import { formatCurrency } from '../../utils/currency';
import useRoleAccess from '../../hooks/useRoleAccess';
import { toast } from 'react-toastify';

export const OrderHistory: React.FC = () => {
  const {
    orders,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    clearError,
    changePage
  } = useOrders();

  const { canCreateOrders } = useRoleAccess();
  const userCanCreateOrders = canCreateOrders();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [orderToRefund, setOrderToRefund] = useState<Order | null>(null);
  const [newlyCreatedOrder, setNewlyCreatedOrder] = useState<unknown>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Fetch orders on component mount
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleFilterChange = (status: OrderStatus | 'all') => {
    setFilterStatus(status);
    const filters: Record<string, unknown> = { page: 1, pageSize };
    if (status !== 'all') {
      filters.status = status;
    }
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    fetchOrders(filters);
  };

  const handleDateFilter = () => {
    const filters: Record<string, unknown> = { page: 1, pageSize };
    if (filterStatus !== 'all') {
      filters.status = filterStatus;
    }
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    fetchOrders(filters);
  };

  const handleViewReceipt = (order: Order) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const handleCreateOrder = async (orderData: unknown) => {
    try {
      await createOrder(orderData);
      toast.success('Order created successfully!');
      // Don't close modal here - will be closed by modal itself
      // Refresh orders list
      fetchOrders();
    } catch (err) {
      console.error('Failed to create order:', err);
      const message = err instanceof Error ? err.message : 'Failed to create order';
      toast.error(message);
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleOrderCreated = (order: unknown) => {
    // Store the created order for printing
    setNewlyCreatedOrder(order as Order);
    setShowReceipt(true);
    setShowNewOrderModal(false);
  };

  const handleRefundOrder = (order: Order) => {
    setOrderToRefund(order);
    setShowReturnModal(true);
  };

  const handleRefundSuccess = () => {
    toast.success('Refund processed successfully!');
    setShowReturnModal(false);
    setOrderToRefund(null);
    fetchOrders(); // Refresh the orders list
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, string> = {
      [OrderStatus.Pending]: 'warning',
      [OrderStatus.Completed]: 'success',
      [OrderStatus.Cancelled]: 'secondary',
      [OrderStatus.Refunded]: 'danger'
    };

    return (
      <Badge bg={variants[status]}>
        {status}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.Cash:
        return <i className="bi bi-cash me-1"></i>;
      case PaymentMethod.Card:
        return <i className="bi bi-credit-card me-1"></i>;
      case PaymentMethod.Mixed:
        return <i className="bi bi-wallet2 me-1"></i>;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-receipt me-2 text-primary"></i>
            Orders
          </h2>
          <p className="text-muted">
            {userCanCreateOrders ? 'Create and manage orders' : 'View order history'}
          </p>
        </Col>
        {userCanCreateOrders && (
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={() => setShowNewOrderModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Order
            </Button>
          </Col>
        )}
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by order number..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>

            <Col md={2}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value as OrderStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value={OrderStatus.Pending}>Pending</option>
                <option value={OrderStatus.Completed}>Completed</option>
                <option value={OrderStatus.Cancelled}>Cancelled</option>
                <option value={OrderStatus.Refunded}>Refunded</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
            </Col>

            <Col md={2}>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </Col>

            <Col md={2}>
              <Button
                variant="primary"
                onClick={handleDateFilter}
                className="w-100"
              >
                <i className="bi bi-funnel me-2"></i>
                Apply Filters
              </Button>
            </Col>

            <Col md={1} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setStartDate('');
                  setEndDate('');
                  fetchOrders();
                }}
              >
                <i className="bi bi-x-circle"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={clearError}
            aria-label="Close"
          ></button>
        </div>
      )}

      <Card>
        <Card.Body>
          {isLoading && orders.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-receipt display-1 text-muted"></i>
              <h4 className="mt-3">No Orders Found</h4>
              <p className="text-muted">
                {searchTerm || filterStatus !== 'all' || startDate || endDate
                  ? 'Try adjusting your search criteria'
                  : 'No orders have been placed yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Payment</th>
                      <th className="text-end">Amount</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.orderNumber}</strong>
                        </td>
                        <td>{formatDate(order.orderDate)}</td>
                        <td>
                          {order.customerName || (
                            <span className="text-muted">Guest</span>
                          )}
                        </td>
                        <td>
                          <Badge bg="info" text="dark">
                            {order.orderItems.length} items
                          </Badge>
                        </td>
                        <td>
                          {getPaymentMethodIcon(order.paymentMethod)}
                          {order.paymentMethod}
                        </td>
                        <td className="text-end">
                          <strong>{formatCurrency(order.totalAmount)}</strong>
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleViewReceipt(order)}
                            title="View Receipt"
                          >
                            <i className="bi bi-receipt"></i>
                          </Button>
                          {order.status === OrderStatus.Completed && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRefundOrder(order)}
                              title="Return/Refund Items"
                            >
                              <i className="bi bi-arrow-return-left"></i>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-3">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <div className="text-center text-muted mt-2">
                    Showing {orders.length} of {totalCount} orders
                  </div>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {(selectedOrder || newlyCreatedOrder) && (
        <OrderReceipt
          show={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setSelectedOrder(null);
            setNewlyCreatedOrder(null);
          }}
          order={(newlyCreatedOrder || selectedOrder) as Order}
        />
      )}

      {/* New Order Modal */}
      <NewOrderModal
        show={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onSubmit={handleCreateOrder}
        onOrderCreated={handleOrderCreated}
      />

      {/* Return/Refund Items Modal */}
      <ReturnItemsModal
        show={showReturnModal}
        order={orderToRefund}
        onClose={() => {
          setShowReturnModal(false);
          setOrderToRefund(null);
        }}
        onRefundSuccess={handleRefundSuccess}
      />
    </Container>
  );
};

export default OrderHistory;
