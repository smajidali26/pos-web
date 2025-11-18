import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Badge, Alert } from 'react-bootstrap';
import { Product } from '../../services/productsService';
import productsService from '../../services/productsService';
import ordersService, { PaymentMethod } from '../../services/ordersService';
import { formatCurrency } from '../../utils/currency';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { getErrorMessage } from '../../types/api';

interface CartItem {
  product: Product;
  quantity: number;
  price: number; // Actual price (can be different from product.price)
  subtotal: number;
}

interface NewOrderModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (orderData: unknown) => Promise<unknown>;
  onOrderCreated?: (order: unknown) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ show, onClose, onSubmit, onOrderCreated }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [amountPaid, setAmountPaid] = useState<string>('');

  const TAX_RATE = 0; // No tax applied

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const change = amountPaid ? parseFloat(amountPaid) - total : 0;

  useEffect(() => {
    if (show) {
      // Reset state when modal opens
      setSearchTerm('');
      setProducts([]);
      setCartItems([]);
      setCustomerName('');
      setAmountPaid('');
      setError(null);
    }
  }, [show]);

  useEffect(() => {
    // Auto-search when user types (debounced)
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      await handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setSearchLoading(true);
      const response = await productsService.getAllProducts({
        searchTerm: searchTerm.trim(),
        isActive: true,
        pageSize: 10
      });
      setProducts(response.items);
    } catch (err) {
      console.error('Search error:', err);
      setError(getErrorMessage(err));
    } finally {
      setSearchLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Increase quantity
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // Add new item with default price
      const newItem: CartItem = {
        product,
        quantity: 1,
        price: product.price,
        subtotal: product.price
      };
      setCartItems([...cartItems, newItem]);
    }

    // Clear search after adding
    setSearchTerm('');
    setProducts([]);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.price * newQuantity
        };
      }
      return item;
    }));
  };

  const updatePrice = (productId: string, newPrice: number) => {
    setCartItems(cartItems.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          price: newPrice,
          subtotal: newPrice * item.quantity
        };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError('Please add at least one product to the cart');
      return;
    }

    const paid = parseFloat(amountPaid);
    if (!amountPaid || isNaN(paid) || paid < total) {
      setError(`Amount paid must be at least ${formatCurrency(total)}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data for API (matching CreateOrderCommand)
      const orderData = {
        cashierId: user?.id, // Current logged-in user
        customerId: null, // Guest order for now
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.price, // Use the actual price (may be modified)
          discountAmount: 0
        }))
      };

      // Prepare full order data for receipt (with calculated fields)
      const fullOrderData = {
        customerId: undefined,
        customerName: customerName.trim() || undefined,
        orderItems: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: 0,
          subtotal: item.subtotal,
          taxAmount: item.subtotal * TAX_RATE,
          total: item.subtotal * (1 + TAX_RATE)
        })),
        subtotal,
        taxAmount: tax,
        discountAmount: 0,
        totalAmount: total,
        paymentMethod: 'Cash',
        amountPaid: paid,
        changeAmount: change,
        notes: customerName.trim() ? `Customer: ${customerName.trim()}` : ''
      };

      // Create the order directly via service to get the ID
      const createResponse = await ordersService.create(orderData);
      const createdOrderId = createResponse.data; // This is a GUID string

      // Complete the order immediately after creation
      try {
        await ordersService.complete(createdOrderId, {
          paymentMethod: PaymentMethod.Cash,
          notes: customerName.trim() ? `Customer: ${customerName.trim()}` : undefined
        });
      } catch (completeError) {
        console.error('Failed to complete order:', completeError);
        // Don't fail the whole operation if complete fails - order is already created
      }

      // Notify parent component about order creation with full order data
      if (onOrderCreated) {
        const createdOrderData = {
          ...fullOrderData,
          id: createdOrderId || 'temp-' + Date.now(),
          orderNumber: 'ORD-' + Date.now(),
          orderDate: new Date().toISOString(),
          status: 'Completed',
          subtotalAmount: fullOrderData.subtotal,
          cashAmount: fullOrderData.amountPaid,
          changeAmount: fullOrderData.changeAmount
        };
        onOrderCreated(createdOrderData);
      }

      onClose();
    } catch (err) {
      console.error('Order submission error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} fullscreen backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>
          New Order
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <div className="row">
            {/* Left Side - Product Search */}
            <div className="col-md-7">
              <h6 className="mb-3">Add Products</h6>

              {/* Search Input */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, SKU, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>

              {/* Search Results */}
              {searchLoading && (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Searching...</span>
                  </div>
                </div>
              )}

              {!searchLoading && products.length > 0 && (
                <div className="border rounded p-2 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="d-flex justify-content-between align-items-center p-2 border-bottom"
                      style={{ cursor: 'pointer' }}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex-grow-1 d-flex align-items-center">
                        <span className="fw-bold">{product.name}</span>
                        {product.sizeName && (
                          <>
                            <span className="text-muted mx-2">|</span>
                            <span className="text-muted">{product.sizeName}</span>
                          </>
                        )}
                        <span className="text-muted mx-2">|</span>
                        <span className="text-muted">
                          <i className="bi bi-tag me-1"></i>
                          {product.categoryName}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-success">{formatCurrency(product.price)}</span>
                        <span className="text-muted">•</span>
                        <Badge bg={product.stockQuantity > 0 ? 'success' : 'danger'}>
                          {product.stockQuantity > 0 ? `Stock: ${product.stockQuantity}` : 'Out of stock'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!searchLoading && searchTerm && products.length === 0 && (
                <Alert variant="info">
                  No products found for "{searchTerm}"
                </Alert>
              )}
            </div>

            {/* Right Side - Cart */}
            <div className="col-md-5">
              <h6 className="mb-3">Order Items ({cartItems.length})</h6>

              {/* Customer Name (Optional) */}
              <Form.Group className="mb-3">
                <Form.Label className="small">Customer Name (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter customer name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  size="sm"
                />
              </Form.Group>

              {/* Cart Items Header */}
              <div className="d-flex align-items-center gap-2 px-2 py-1 bg-light border-top border-bottom">
                <div className="flex-grow-1 small fw-bold" style={{ minWidth: '120px' }}>
                  Product Name
                </div>
                <div className="small fw-bold text-center" style={{ width: '90px' }}>
                  Price
                </div>
                <div className="small fw-bold text-center" style={{ width: '100px' }}>
                  Quantity
                </div>
                <div className="small fw-bold text-end" style={{ minWidth: '90px' }}>
                  Subtotal
                </div>
                <div style={{ width: '38px' }}></div>
              </div>

              {/* Cart Items */}
              <div className="border-start border-end border-bottom rounded-bottom" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {cartItems.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-cart3" style={{ fontSize: '2rem' }}></i>
                    <p className="mb-0 mt-2 small">Cart is empty</p>
                    <p className="mb-0 small">Search and add products</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.product.id} className="d-flex align-items-center gap-2 p-2 border-bottom">
                      <div className="flex-grow-1" style={{ minWidth: '120px' }}>
                        <div className="small fw-bold text-truncate" title={`${item.product.name}${item.product.sizeName ? ` (${item.product.sizeName})` : ''} - ${formatCurrency(item.product.price)}`}>
                          {item.product.name}
                          {item.product.sizeName && <span className="text-muted"> ({item.product.sizeName})</span>}
                          <br />
                          <span className="text-primary">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <div style={{ width: '90px' }}>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => updatePrice(item.product.id, parseFloat(e.target.value) || 0)}
                          size="sm"
                        />
                      </div>
                      <div className="btn-group btn-group-sm" style={{ width: '100px' }}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="btn btn-outline-secondary">{item.quantity}</span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-end fw-bold" style={{ minWidth: '90px' }}>
                        {formatCurrency(item.subtotal)}
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Order Summary */}
              {cartItems.length > 0 && (
                <>
                  <div className="border rounded p-3 mb-3 bg-light">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {TAX_RATE > 0 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <strong>Total:</strong>
                      <strong className="text-success">{formatCurrency(total)}</strong>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="border rounded p-3 bg-light">
                    <Form.Group className="mb-2">
                      <Form.Label className="small fw-bold">
                        <i className="bi bi-cash me-1"></i>
                        Amount Paid (Cash)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        required
                      />
                    </Form.Group>
                    {amountPaid && !isNaN(parseFloat(amountPaid)) && (
                      <div className="d-flex justify-content-between pt-2 border-top">
                        <span className="fw-bold">Change:</span>
                        <span className={`fw-bold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(Math.max(0, change))}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Complete Order ({formatCurrency(total)})
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NewOrderModal;
