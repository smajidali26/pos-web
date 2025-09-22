import React from 'react';
import { Link } from 'react-router-dom';
import useRoleAccess from '../../hooks/useRoleAccess';

const Unauthorized: React.FC = () => {
  const { userRole, roleDisplayName } = useRoleAccess();

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mt-5">
            {/* Error Icon */}
            <div className="mb-4">
              <i className="bi bi-shield-exclamation text-danger" style={{ fontSize: '5rem' }}></i>
            </div>

            {/* Error Message */}
            <h1 className="display-4 text-danger mb-3">Access Denied</h1>
            <p className="lead text-muted mb-4">
              You don't have permission to access this page.
            </p>

            {/* User Role Info */}
            <div className="alert alert-info">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-badge me-2"></i>
                <div>
                  <strong>Current Role:</strong> {roleDisplayName}
                  {userRole && (
                    <small className="d-block text-muted">
                      This page requires Owner or Manager access
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Link to="/sales" className="btn btn-primary">
                <i className="bi bi-receipt me-2"></i>
                Go to Sales
              </Link>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-4">
              <p className="text-muted small">
                If you believe this is an error, please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
