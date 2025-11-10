import React, { useState, useEffect } from 'react';
import useRoleAccess from '../../hooks/useRoleAccess';
import ordersService, { Order, OrderStatus } from '../../services/ordersService';
import { formatCurrency } from '../../utils/currency';
import { toast } from 'react-toastify';

interface SalesStats {
  today: { total: number; count: number };
  week: { total: number; count: number };
  month: { total: number; count: number };
}

interface ProductSales {
  productName: string;
  quantity: number;
  revenue: number;
}

const Reports: React.FC = () => {
  const { canAccessReports } = useRoleAccess();
  const userCanAccessReports = canAccessReports();

  const [loading, setLoading] = useState(true);
  const [salesStats, setSalesStats] = useState<SalesStats>({
    today: { total: 0, count: 0 },
    week: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
  });
  const [topProducts, setTopProducts] = useState<ProductSales[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    if (userCanAccessReports) {
      fetchReportsData();
    }
  }, [userCanAccessReports]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      // Calculate date ranges
      const now = new Date();

      // Today
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      // Week
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      weekStart.setHours(0, 0, 0, 0);

      // Month
      const monthStart = new Date(now);
      monthStart.setDate(now.getDate() - 30);
      monthStart.setHours(0, 0, 0, 0);

      // Fetch all completed orders
      const [todayOrders, weekOrders, monthOrders] = await Promise.all([
        ordersService.getAll({
          status: OrderStatus.Completed,
          startDate: todayStart.toISOString(),
          pageSize: 1000
        }),
        ordersService.getAll({
          status: OrderStatus.Completed,
          startDate: weekStart.toISOString(),
          pageSize: 1000
        }),
        ordersService.getAll({
          status: OrderStatus.Completed,
          startDate: monthStart.toISOString(),
          pageSize: 1000
        })
      ]);

      // Calculate stats
      const todayTotal = todayOrders.data.items.reduce((sum, order) => sum + order.totalAmount, 0);
      const weekTotal = weekOrders.data.items.reduce((sum, order) => sum + order.totalAmount, 0);
      const monthTotal = monthOrders.data.items.reduce((sum, order) => sum + order.totalAmount, 0);

      setSalesStats({
        today: { total: todayTotal, count: todayOrders.data.items.length },
        week: { total: weekTotal, count: weekOrders.data.items.length },
        month: { total: monthTotal, count: monthOrders.data.items.length }
      });

      // Calculate top products
      const productSales = new Map<string, ProductSales>();

      monthOrders.data.items.forEach(order => {
        order.orderItems.forEach(item => {
          const existing = productSales.get(item.productName);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.total;
          } else {
            productSales.set(item.productName, {
              productName: item.productName,
              quantity: item.quantity,
              revenue: item.total
            });
          }
        });
      });

      const topProductsList = Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setTopProducts(topProductsList);

    } catch (err: any) {
      console.error('Failed to fetch reports data:', err);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  if (!userCanAccessReports) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          You don't have permission to access reports.
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
            <i className="bi bi-graph-up me-2 text-primary"></i>
            Reports
          </h2>
          <p className="text-muted mb-0">View sales reports and analytics</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={fetchReportsData}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Sales Performance Cards */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-day text-primary" style={{ fontSize: '2rem' }}></i>
                    <h5 className="card-title mb-0 ms-3">Today's Sales</h5>
                  </div>
                  <h2 className="mb-2">{formatCurrency(salesStats.today.total)}</h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    {salesStats.today.count} transaction{salesStats.today.count !== 1 ? 's' : ''}
                  </p>
                  <div className="text-muted small mt-2">
                    Avg: {formatCurrency(salesStats.today.count > 0 ? salesStats.today.total / salesStats.today.count : 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-week text-success" style={{ fontSize: '2rem' }}></i>
                    <h5 className="card-title mb-0 ms-3">Last 7 Days</h5>
                  </div>
                  <h2 className="mb-2">{formatCurrency(salesStats.week.total)}</h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    {salesStats.week.count} transaction{salesStats.week.count !== 1 ? 's' : ''}
                  </p>
                  <div className="text-muted small mt-2">
                    Avg: {formatCurrency(salesStats.week.count > 0 ? salesStats.week.total / salesStats.week.count : 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-month text-warning" style={{ fontSize: '2rem' }}></i>
                    <h5 className="card-title mb-0 ms-3">Last 30 Days</h5>
                  </div>
                  <h2 className="mb-2">{formatCurrency(salesStats.month.total)}</h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    {salesStats.month.count} transaction{salesStats.month.count !== 1 ? 's' : ''}
                  </p>
                  <div className="text-muted small mt-2">
                    Avg: {formatCurrency(salesStats.month.count > 0 ? salesStats.month.total / salesStats.month.count : 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-trophy me-2 text-warning"></i>
                    Top 10 Products (Last 30 Days)
                  </h5>
                </div>
                <div className="card-body">
                  {topProducts.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                      <i className="bi bi-box" style={{ fontSize: '3rem' }}></i>
                      <p className="mt-2">No product sales data available</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Quantity Sold</th>
                            <th>Total Revenue</th>
                            <th>Avg Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topProducts.map((product, index) => (
                            <tr key={product.productName}>
                              <td>
                                <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'}`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td><strong>{product.productName}</strong></td>
                              <td>{product.quantity}</td>
                              <td><strong>{formatCurrency(product.revenue)}</strong></td>
                              <td>{formatCurrency(product.revenue / product.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="card border-0 shadow-sm bg-light">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-graph-up-arrow me-2 text-success"></i>
                    Growth Metrics
                  </h6>
                  <div className="row mt-3">
                    <div className="col-6">
                      <div className="small text-muted">Weekly vs Today</div>
                      <div className="h5">
                        {salesStats.today.count > 0 && salesStats.week.count > 0
                          ? `${((salesStats.week.total / 7) / (salesStats.today.total || 1) * 100 - 100).toFixed(1)}%`
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="small text-muted">Monthly vs Weekly</div>
                      <div className="h5">
                        {salesStats.week.count > 0 && salesStats.month.count > 0
                          ? `${((salesStats.month.total / 30) / (salesStats.week.total / 7 || 1) * 100 - 100).toFixed(1)}%`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card border-0 shadow-sm bg-light">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    Quick Insights
                  </h6>
                  <div className="mt-3">
                    <div className="small mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      All data is based on completed orders
                    </div>
                    <div className="small mb-2">
                      <i className="bi bi-currency-dollar text-primary me-2"></i>
                      Amounts shown in {formatCurrency(0).split(' ')[0]} (PKR)
                    </div>
                    <div className="small">
                      <i className="bi bi-clock text-warning me-2"></i>
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
