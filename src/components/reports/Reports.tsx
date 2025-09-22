import React from 'react';
import useRoleAccess from '../../hooks/useRoleAccess';

const Reports: React.FC = () => {
  const { canAccessReports } = useRoleAccess();
  const userCanAccessReports = canAccessReports();

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
      </div>

      {/* Reports Content */}
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-day text-primary" style={{ fontSize: '3rem' }}></i>
              <h5 className="card-title mt-3">Daily Sales</h5>
              <p className="card-text text-muted">View daily sales performance</p>
              <button className="btn btn-outline-primary">View Report</button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-week text-success" style={{ fontSize: '3rem' }}></i>
              <h5 className="card-title mt-3">Weekly Sales</h5>
              <p className="card-text text-muted">View weekly sales trends</p>
              <button className="btn btn-outline-success">View Report</button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-month text-warning" style={{ fontSize: '3rem' }}></i>
              <h5 className="card-title mt-3">Monthly Sales</h5>
              <p className="card-text text-muted">View monthly performance</p>
              <button className="btn btn-outline-warning">View Report</button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-box text-info" style={{ fontSize: '3rem' }}></i>
              <h5 className="card-title mt-3">Product Performance</h5>
              <p className="card-text text-muted">View top-selling products</p>
              <button className="btn btn-outline-info">View Report</button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-people text-secondary" style={{ fontSize: '3rem' }}></i>
              <h5 className="card-title mt-3">Customer Analytics</h5>
              <p className="card-text text-muted">View customer insights</p>
              <button className="btn btn-outline-secondary">View Report</button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-file-earmark-excel text-success" style={{ fontSize: '3rem' }}></i>
              <h5 className="card-title mt-3">Export Data</h5>
              <p className="card-text text-muted">Export reports to Excel/CSV</p>
              <button className="btn btn-outline-success">Export</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Reports Module:</strong> This section will display comprehensive sales reports and analytics once connected to your backend API.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
