import React from 'react';
import useRoleAccess from '../../hooks/useRoleAccess';

const Sales: React.FC = () => {
  const { canAccessSales } = useRoleAccess();
  const userCanAccessSales = canAccessSales();

  if (!userCanAccessSales) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          You don't have permission to access sales.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="bi bi-cart-check me-2 text-primary"></i>
            Sales
          </h2>
          <p className="text-muted mb-0">Process sales transactions and manage orders</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          New Sale
        </button>
      </div>

      {/* Sales Dashboard */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-currency-dollar text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="small text-muted">Today's Sales</div>
                  <div className="h4 mb-0">$2,543.67</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-receipt text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="small text-muted">Transactions</div>
                  <div className="h4 mb-0">47</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-graph-up text-info" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="small text-muted">Average Sale</div>
                  <div className="h4 mb-0">$54.12</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-clock text-warning" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="small text-muted">Pending Orders</div>
                  <div className="h4 mb-0">3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Recent Transactions</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search transactions..."
                style={{ width: '200px' }}
              />
              <button className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-funnel"></i> Filter
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#TXN-2024-001</td>
                  <td>Dec 12, 2024 2:30 PM</td>
                  <td>John Doe</td>
                  <td>3 items</td>
                  <td><strong>$67.89</strong></td>
                  <td>
                    <span className="badge bg-primary">Credit Card</span>
                  </td>
                  <td>
                    <span className="badge bg-success">Completed</span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" title="View Details">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-outline-secondary" title="Print Receipt">
                        <i className="bi bi-printer"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>#TXN-2024-002</td>
                  <td>Dec 12, 2024 1:45 PM</td>
                  <td>Jane Smith</td>
                  <td>1 item</td>
                  <td><strong>$29.99</strong></td>
                  <td>
                    <span className="badge bg-success">Cash</span>
                  </td>
                  <td>
                    <span className="badge bg-success">Completed</span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" title="View Details">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-outline-secondary" title="Print Receipt">
                        <i className="bi bi-printer"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>#TXN-2024-003</td>
                  <td>Dec 12, 2024 12:15 PM</td>
                  <td>Bob Wilson</td>
                  <td>5 items</td>
                  <td><strong>$134.50</strong></td>
                  <td>
                    <span className="badge bg-info">Debit Card</span>
                  </td>
                  <td>
                    <span className="badge bg-warning">Pending</span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" title="View Details">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-outline-warning" title="Process Payment">
                        <i className="bi bi-credit-card"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Sales Module:</strong> This section will integrate with your POS system to process real transactions and manage sales data.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
