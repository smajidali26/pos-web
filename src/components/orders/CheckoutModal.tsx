import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Table, Badge } from 'react-bootstrap';
import { Customer } from '../../services/customersService';
import { PaymentMethod } from '../../services/ordersService';
import paymentsService from '../../services/paymentsService';
import { formatCurrency } from '../../utils/currency';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  taxRate?: number;
}

interface CheckoutModalProps {
  show: boolean;
  onClose: () => void;
  onComplete: (order: any) => void;
  cartItems: CartItem[];
  customer?: Customer | null;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  show,
  onClose,
  onComplete,
  cartItems,
  customer,
  total,
  subtotal,
  tax,
  discount
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [cardPaymentProcessing, setCardPaymentProcessing] = useState(false);
  const [stripeAvailable, setStripeAvailable] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Check Stripe availability on mount
  useEffect(() => {
    const checkStripe = async () => {
      try {
        const response = await paymentsService.checkStripeAvailability();
        setStripeAvailable(response.data.available);
        if (!response.data.available) {
          // Force cash payment if Stripe not available
          setPaymentMethod(PaymentMethod.Cash);
        }
      } catch (err) {
        console.warn('Stripe availability check failed, defaulting to cash only');
        setStripeAvailable(false);
        setPaymentMethod(PaymentMethod.Cash);
      }
    };

    if (show) {
      checkStripe();
    }
  }, [show]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setCashReceived('');
      setNotes('');
      setError(null);
      setValidationError(null);
      setCardPaymentProcessing(false);
    }
  }, [show]);

  const calculateChange = (): number => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - total);
  };

  const validateCashPayment = (): boolean => {
    const received = parseFloat(cashReceived);

    if (isNaN(received) || received <= 0) {
      setValidationError('Please enter a valid amount');
      return false;
    }

    if (received < total) {
      setValidationError(`Insufficient payment. Required: ${formatCurrency(total)}`);
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValidationError(null);
    setError(null);
  };

  const handleCashReceivedChange = (value: string) => {
    // Only allow numbers and one decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return; // Prevent multiple decimals

    setCashReceived(cleaned);
    setValidationError(null);
  };

  const handleQuickCash = (amount: number) => {
    setCashReceived(amount.toString());
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (paymentMethod === PaymentMethod.Cash) {
        if (!validateCashPayment()) {
          return;
        }

        const changeAmount = calculateChange();

        const orderData = {
          customerId: customer?.id,
          orderItems: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            discount: item.discount || 0
          })),
          paymentMethod: PaymentMethod.Cash,
          cashAmount: total,
          notes: notes || undefined
        };

        const result = {
          ...orderData,
          cashReceived: parseFloat(cashReceived),
          changeAmount,
          totalAmount: total,
          subtotalAmount: subtotal,
          taxAmount: tax,
          discountAmount: discount
        };

        onComplete(result);
      } else if (paymentMethod === PaymentMethod.Card) {
        if (!stripeAvailable) {
          setError('Card payment is not available. Please use cash payment.');
          return;
        }

        setCardPaymentProcessing(true);

        // Create payment intent
        const intentResponse = await paymentsService.createPaymentIntent({
          amount: total,
          currency: 'usd',
          customerId: customer?.id,
          description: `Order for ${cartItems.length} items`
        });

        // In a real implementation, you would integrate Stripe Elements here
        // For now, we'll show a message
        setError('Stripe payment integration requires additional frontend setup with Stripe Elements.');
        setCardPaymentProcessing(false);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || err.message || 'Payment processing failed');
      setCardPaymentProcessing(false);
    }
  };

  const quickCashAmounts = [
    { label: 'Exact', value: total },
    { label: '$20', value: 20 },
    { label: '$50', value: 50 },
    { label: '$100', value: 100 }
  ].filter(option => option.value >= total || option.label === 'Exact');

  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {!stripeAvailable && (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Card payments are not configured. Cash payment only.
            </Alert>
          )}

          {/* Customer Info */}
          {customer && (
            <div className="mb-3 p-3 bg-light rounded">
              <h6 className="mb-2">
                <i className="bi bi-person me-2"></i>
                Customer
              </h6>
              <div>
                <strong>{customer.firstName} {customer.lastName}</strong>
                <div className="text-muted small">{customer.email}</div>
                <div className="text-muted small">{customer.phone}</div>
                {customer.loyaltyPoints && customer.loyaltyPoints > 0 && (
                  <Badge bg="warning" text="dark" className="mt-1">
                    {customer.loyaltyPoints} loyalty points
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-3">
            <h6 className="mb-2">
              <i className="bi bi-cart me-2"></i>
              Order Summary ({cartItems.length} items)
            </h6>
            <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <Table size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-end">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between mb-1">
              <span>Subtotal:</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-1 text-success">
                <span>Discount:</span>
                <strong>{formatCurrency(-discount)}</strong>
              </div>
            )}
            <div className="d-flex justify-content-between mb-1">
              <span>Tax:</span>
              <strong>{formatCurrency(tax)}</strong>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <span className="h5 mb-0">Total:</span>
              <span className="h5 mb-0">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Payment Method</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                label={
                  <span>
                    <i className="bi bi-cash me-2"></i>
                    Cash
                  </span>
                }
                name="paymentMethod"
                value={PaymentMethod.Cash}
                checked={paymentMethod === PaymentMethod.Cash}
                onChange={() => handlePaymentMethodChange(PaymentMethod.Cash)}
              />
              <Form.Check
                type="radio"
                label={
                  <span>
                    <i className="bi bi-credit-card me-2"></i>
                    Card {!stripeAvailable && <small className="text-muted">(unavailable)</small>}
                  </span>
                }
                name="paymentMethod"
                value={PaymentMethod.Card}
                checked={paymentMethod === PaymentMethod.Card}
                onChange={() => handlePaymentMethodChange(PaymentMethod.Card)}
                disabled={!stripeAvailable}
              />
            </div>
          </Form.Group>

          {/* Cash Payment Fields */}
          {paymentMethod === PaymentMethod.Cash && (
            <>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Cash Received <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter amount"
                      value={cashReceived}
                      onChange={(e) => handleCashReceivedChange(e.target.value)}
                      isInvalid={!!validationError}
                      autoFocus
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationError}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Quick Cash Buttons */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex gap-2 flex-wrap">
                    {quickCashAmounts.map(option => (
                      <Button
                        key={option.label}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleQuickCash(option.value)}
                        type="button"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </Col>
              </Row>

              {/* Change Amount */}
              {cashReceived && parseFloat(cashReceived) >= total && (
                <Alert variant="success">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Change to give:</span>
                    <strong className="h5 mb-0">{formatCurrency(calculateChange())}</strong>
                  </div>
                </Alert>
              )}
            </>
          )}

          {/* Card Payment Info */}
          {paymentMethod === PaymentMethod.Card && stripeAvailable && (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              Card payment processing requires Stripe Elements integration.
              This is a placeholder for the Stripe payment form.
            </Alert>
          )}

          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Add any notes for this order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={cardPaymentProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={cardPaymentProcessing || (paymentMethod === PaymentMethod.Cash && !cashReceived)}
          >
            {cardPaymentProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Complete Sale
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckoutModal;
