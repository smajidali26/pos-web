import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Table } from 'react-bootstrap';
import { Order, OrderItem } from '../../services/ordersService';
import ordersService from '../../services/ordersService';
import { formatCurrency } from '../../utils/currency';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../types/api';

interface ReturnItemsModalProps {
  show: boolean;
  order: Order | null;
  onClose: () => void;
  onRefundSuccess: () => void;
}

interface RefundItem {
  orderItem: OrderItem;
  quantityToRefund: number;
  maxQuantity: number;
}

export const ReturnItemsModal: React.FC<ReturnItemsModalProps> = ({
  show,
  order,
  onClose,
  onRefundSuccess
}) => {
  const [refundItems, setRefundItems] = useState<RefundItem[]>([]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && show) {
      // Initialize refund items from order
      const items = order.orderItems.map(item => ({
        orderItem: item,
        quantityToRefund: 0,
        maxQuantity: item.quantity
      }));
      setRefundItems(items);
      setReason('');
      setError('');
    }
  }, [order, show]);

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...refundItems];
    const item = newItems[index];

    // Ensure quantity is within valid range
    if (quantity < 0) {
      quantity = 0;
    } else if (quantity > item.maxQuantity) {
      quantity = item.maxQuantity;
    }

    newItems[index].quantityToRefund = quantity;
    setRefundItems(newItems);
  };

  const handleSelectAll = () => {
    const newItems = refundItems.map(item => ({
      ...item,
      quantityToRefund: item.maxQuantity
    }));
    setRefundItems(newItems);
  };

  const handleClearAll = () => {
    const newItems = refundItems.map(item => ({
      ...item,
      quantityToRefund: 0
    }));
    setRefundItems(newItems);
  };

  const calculateRefundAmount = () => {
    return refundItems.reduce((total, item) => {
      const itemTotal = (item.orderItem.unitPrice * item.quantityToRefund) -
                       (item.orderItem.discount * item.quantityToRefund / item.orderItem.quantity);
      return total + itemTotal;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get items with quantity to refund > 0
    const itemsToRefund = refundItems
      .filter(item => item.quantityToRefund > 0)
      .map(item => ({
        orderItemId: item.orderItem.id!,
        quantityToRefund: item.quantityToRefund
      }));

    if (itemsToRefund.length === 0) {
      setError('Please select at least one item to refund');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the refund');
      return;
    }

    try {
      setLoading(true);
      await ordersService.refundItems(order!.id, itemsToRefund, reason.trim());

      toast.success('Items refunded successfully!');
      onRefundSuccess();
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRefundItems([]);
    setReason('');
    setError('');
    onClose();
  };

  const refundAmount = calculateRefundAmount();
  const hasItemsSelected = refundItems.some(item => item.quantityToRefund > 0);

  if (!order) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-arrow-return-left me-2"></i>
          Return/Refund Items
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Alert variant="info">
            <strong>Order #{order.orderNumber}</strong>
            <div className="small mt-1">
              Original Total: {formatCurrency(order.totalAmount)}
            </div>
          </Alert>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Select Items to Return</h6>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </div>

          <Table responsive bordered>
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ width: '120px' }}>Ordered</th>
                <th style={{ width: '120px' }}>Return Qty</th>
                <th style={{ width: '120px' }}>Unit Price</th>
                <th style={{ width: '120px' }}>Refund</th>
              </tr>
            </thead>
            <tbody>
              {refundItems.map((item, index) => {
                const refundForItem = (item.orderItem.unitPrice * item.quantityToRefund) -
                                     (item.orderItem.discount * item.quantityToRefund / item.orderItem.quantity);
                return (
                  <tr key={item.orderItem.id || index}>
                    <td>
                      <strong>{item.orderItem.productName}</strong>
                      {item.orderItem.categoryName && (
                        <div className="small text-muted">{item.orderItem.categoryName}</div>
                      )}
                    </td>
                    <td className="text-center">{item.orderItem.quantity}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max={item.maxQuantity}
                        value={item.quantityToRefund}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                        size="sm"
                      />
                    </td>
                    <td className="text-end">{formatCurrency(item.orderItem.unitPrice)}</td>
                    <td className="text-end">
                      <strong className={item.quantityToRefund > 0 ? 'text-danger' : ''}>
                        {formatCurrency(refundForItem)}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-end"><strong>Total Refund Amount:</strong></td>
                <td className="text-end">
                  <strong className="text-danger fs-5">{formatCurrency(refundAmount)}</strong>
                </td>
              </tr>
            </tfoot>
          </Table>

          <Form.Group className="mt-3">
            <Form.Label>Reason for Return/Refund *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Damaged product, Customer request, Quality issue, etc."
            />
          </Form.Group>

          <Alert variant="warning" className="mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <small>
              <strong>Important:</strong> This action will restore the refunded items back to inventory
              and update the order status. This cannot be undone.
            </small>
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            type="submit"
            disabled={loading || !hasItemsSelected || !reason.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-return-left me-2"></i>
                Process Refund ({formatCurrency(refundAmount)})
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
