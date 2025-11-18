import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { EmployeeProfile } from '../../services/employeeProfileService';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeCardProps {
  employee: EmployeeProfile;
  onEdit?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="card-title mb-1">
              {employee.user?.firstName} {employee.user?.lastName}
            </h5>
            <p className="text-muted small mb-0">{employee.employeeCode}</p>
          </div>
          <EmployeeStatusBadge status={employee.status} />
        </div>

        <div className="mb-3">
          <div className="small text-muted">Position</div>
          <div>{employee.jobTitle || 'N/A'}</div>
        </div>

        <div className="mb-3">
          <div className="small text-muted">Department</div>
          <div>{employee.department || 'N/A'}</div>
        </div>

        <div className="mb-3">
          <div className="small text-muted">Hourly Rate</div>
          <div>${employee.hourlyRate?.toFixed(2)}/hr</div>
        </div>

        <div className="d-flex justify-content-between">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/employees/${employee.id}`)}
          >
            <i className="fas fa-eye mr-1"></i> View
          </Button>
          {onEdit && (
            <Button variant="outline-secondary" size="sm" onClick={onEdit}>
              <i className="fas fa-edit mr-1"></i> Edit
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
