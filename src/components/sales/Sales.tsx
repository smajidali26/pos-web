import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRoleAccess from '../../hooks/useRoleAccess';
import ordersService, { Order, OrderStatus } from '../../services/ordersService';
import { formatCurrency } from '../../utils/currency';
import { toast } from 'react-toastify';

const Sales: React.FC = () => {
  const navigate = useNavigate();
  const { canAccessSales, canCreateOrders } = useRoleAccess();
  const userCanAccessSales = canAccessSales();

  const [todaysSales, setTodaysSales] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [averageSale, setAverageSale] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Date filter states
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'custom'>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (userCanAccessSales) {
      fetchSalesData();
    }
  }, [userCanAccessSales, dateFilter, startDate, endDate]);

  const getDateRange = (): { start: string; end: string } => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (dateFilter) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case 'yesterday':
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;

      case 'week':
        // Get start of week (Sunday)
        const day = now.getDay();
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        } else {
          // Default to today if custom dates not set
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        }
        break;
    }

    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  };

  const fetchSalesData = async () => {
    try {
      setLoading(true);

      // Get date range based on filter
      const dateRange = getDateRange();

      // Fetch completed orders for the selected date range
      const completedResponse = await ordersService.getAll({
        status: OrderStatus.Completed,
        startDate: dateRange.start,
        endDate: dateRange.end,
        pageSize: 1000
      });

      const completedOrders = completedResponse.data.items;

      // Calculate sales for selected period
      const totalSales = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      setTodaysSales(totalSales);
      setTransactionCount(completedOrders.length);
      setAverageSale(completedOrders.length > 0 ? totalSales / completedOrders.length : 0);

      // Fetch pending orders (not date-filtered)
      const pendingResponse = await ordersService.getAll({
        status: OrderStatus.Pending,
        pageSize: 1000
      });
      setPendingOrders(pendingResponse.data.totalCount);

      // Set recent orders from selected period
      setRecentOrders(completedOrders.slice(0, 100));

    } catch (err: any) {
      console.error('Failed to fetch sales data:', err);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId: string) => {
    // Navigate to orders page or show details modal
    navigate(`/orders`);
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return 'success';
      case 'card':
        return 'primary';
      case 'mixed':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getFilterLabel = (): string => {
    switch (dateFilter) {
      case 'today':
        return "Today's";
      case 'yesterday':
        return "Yesterday's";
      case 'week':
        return "This Week's";
      case 'month':
        return "This Month's";
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate).toLocaleDateString();
          const end = new Date(endDate).toLocaleDateString();
          return `${start} - ${end}`;
        }
        return 'Custom Range';
      default:
        return "Today's";
    }
  };

  const handleDateFilterChange = (filter: 'today' | 'yesterday' | 'week' | 'month' | 'custom') => {
    setDateFilter(filter);
    if (filter !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  const filteredOrders = searchTerm
    ? recentOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : recentOrders;

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
          <p className="text-muted mb-0">View sales transactions and performance</p>
        </div>
        {canCreateOrders() && (
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>
            <i className="bi bi-plus-circle me-2"></i>
            New Order
          </button>
        )}
      </div>

      {/* Date Filter */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row align-items-center g-2">
            <div className="col-auto">
              <label className="form-label mb-0 text-muted small">
                <i className="bi bi-calendar-range me-1"></i>
                Period:
              </label>
            </div>
            <div className="col">
              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn ${dateFilter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDateFilterChange('today')}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`btn ${dateFilter === 'yesterday' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDateFilterChange('yesterday')}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  className={`btn ${dateFilter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDateFilterChange('week')}
                >
                  This Week
                </button>
                <button
                  type="button"
                  className={`btn ${dateFilter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDateFilterChange('month')}
                >
                  This Month
                </button>
                <button
                  type="button"
                  className={`btn ${dateFilter === 'custom' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDateFilterChange('custom')}
                >
                  Custom
                </button>
              </div>
            </div>

            {dateFilter === 'custom' && (
              <>
                <div className="col-auto">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ width: '150px' }}
                  />
                </div>
                <div className="col-auto">
                  <span className="text-muted">to</span>
                </div>
                <div className="col-auto">
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ width: '150px' }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sales Dashboard */}
      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-currency-dollar text-success me-3" style={{ fontSize: '1.75rem' }}></i>
                      <span className="text-muted small">{getFilterLabel()} Sales:</span>
                    </div>
                    <div className="h5 mb-0 fw-bold">{formatCurrency(todaysSales)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-receipt text-primary me-3" style={{ fontSize: '1.75rem' }}></i>
                      <span className="text-muted small">Transactions:</span>
                    </div>
                    <div className="h5 mb-0 fw-bold">{transactionCount}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-graph-up text-info me-3" style={{ fontSize: '1.75rem' }}></i>
                      <span className="text-muted small">Average Sale:</span>
                    </div>
                    <div className="h5 mb-0 fw-bold">{formatCurrency(averageSale)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-clock text-warning me-3" style={{ fontSize: '1.75rem' }}></i>
                      <span className="text-muted small">Pending Orders:</span>
                    </div>
                    <div className="h5 mb-0 fw-bold">{pendingOrders}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{getFilterLabel()} Completed Transactions</h5>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search transactions..."
                    style={{ width: '200px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary btn-sm" onClick={fetchSalesData}>
                    <i className="bi bi-arrow-clockwise"></i> Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {filteredOrders.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  <i className="bi bi-receipt" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-2">
                    {searchTerm
                      ? 'No transactions found matching your search'
                      : `No completed transactions for ${getFilterLabel().toLowerCase()} period`
                    }
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date & Time</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                        <th>Cashier</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.orderNumber}</td>
                          <td>{new Date(order.orderDate).toLocaleString()}</td>
                          <td>{order.customerName || 'Walk-in Customer'}</td>
                          <td>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</td>
                          <td><strong>{formatCurrency(order.totalAmount)}</strong></td>
                          <td>
                            <span className={`badge bg-${getPaymentMethodBadge(order.paymentMethod)}`}>
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td>{order.cashierName || 'Unknown'}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                title="View Details"
                                onClick={() => handleViewDetails(order.id)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sales;
