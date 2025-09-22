import React, { useEffect } from 'react';
import useCart from '../../hooks/useCart';
import useProducts from '../../hooks/useProducts';
import type { CartItem } from '../../store/cart/types';

const Dashboard: React.FC = () => {
  // Custom hooks for state management
  const cart = useCart();
  const products = useProducts();

  // Type assertions for cart properties
  const cartItems = cart.items as CartItem[];
  const cartTotal = cart.total as number;
  const cartItemCount = cart.itemCount as number;
  const cartIsEmpty = cart.isEmpty as boolean;

  // Debug: Log when Dashboard component mounts/updates
  useEffect(() => {
    console.log('Dashboard component loaded/updated');
  }, []);

  return (
    <div className="container-fluid">
      {/* Main Content */}
      <div className="row">
        {/* Product Grid */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Products</h5>
                <div className="d-flex gap-2">
                  {/* Search */}
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search products..."
                    value={products.searchTerm}
                    onChange={(e) => products.handleSearchChange(e.target.value)}
                    style={{ width: '200px' }}
                  />
                  {/* Category Filter */}
                  <select
                    className="form-select form-select-sm"
                    value={products.selectedCategoryId}
                    onChange={(e) => products.handleCategoryChange(e.target.value)}
                    style={{ width: '130px' }}
                  >
                    <option value="">All Categories</option>
                    {products.categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {/* Clear Filters */}
                  {(products.searchTerm || products.selectedCategoryId !== '') && (
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={products.clearFilters}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                {products.products.map(product => (
                  <div key={product.id} className="col-md-4 mb-3">
                    <div className="card border-primary product-card">
                      <div className="card-body text-center">
                        <div style={{ fontSize: '2rem' }}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px' }} />
                          ) : (
                            '📦'
                          )}
                        </div>
                        <h6 className="card-title">{product.name}</h6>
                        <p className="card-text text-muted">${product.price.toFixed(2)}</p>
                        <span className="badge bg-secondary mb-2">{product.category}</span>
                        <br />
                        {cart.isInCart(product.id) ? (
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <div className="btn-group btn-group-sm" role="group">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => cart.updateQty(product.id, cart.getItemQuantity(product.id) - 1)}
                              >
                                -
                              </button>
                              <span className="btn btn-outline-primary">
                                {cart.getItemQuantity(product.id)}
                              </span>
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => cart.updateQty(product.id, cart.getItemQuantity(product.id) + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => cart.add(product)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {products.products.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-search text-muted" style={{fontSize: '3rem'}}></i>
                  <p className="text-muted mt-2">No products found</p>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={products.clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Shopping Cart</h5>
              <span className={`badge bg-secondary ${cartItemCount > 0 ? 'updated' : ''}`}>
                {cartItemCount} items
              </span>
            </div>
            <div className="card-body">
              {cartIsEmpty ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart3 text-muted" style={{fontSize: '3rem'}}></i>
                  <p className="text-muted mt-2">Your cart is empty</p>
                </div>
              ) : (
                <div>
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item d-flex justify-content-between align-items-center mb-3">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">${item.price.toFixed(2)} each</small>
                        <div className="mt-1">
                          <strong>${item.subtotal.toFixed(2)}</strong>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="btn-group btn-group-sm" role="group">
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => cart.updateQty(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="btn btn-outline-secondary">{item.quantity}</span>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => cart.updateQty(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => cart.remove(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Total: ${cartTotal.toFixed(2)}</strong>
                {!cartIsEmpty && (
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={cart.clear}
                  >
                    Clear Cart
                  </button>
                )}
              </div>
              <button 
                className="btn btn-success w-100" 
                disabled={cartIsEmpty}
              >
                Checkout ({cartItemCount} items)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            Welcome to POSWeb! This POS system uses <strong>React Redux</strong> for state management.
            Cart items: <strong>{cartItemCount}</strong> | Total: <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
