import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { EmployeeProfile } from '../../services/employeeProfileService';
import { EmployeeStatusBadge } from './EmployeeStatusBadge';

interface EmployeeDetailsCardProps {
  employee: EmployeeProfile;
}

export const EmployeeDetailsCard: React.FC<EmployeeDetailsCardProps> = ({ employee }) => {
  return (
    <Card className="mb-3">
      <Card.Body className="text-center">
        <div className="mb-3">
          <i className="fas fa-user-circle fa-5x text-secondary"></i>
        </div>
        <h4>{employee.user?.firstName} {employee.user?.lastName}</h4>
        <p className="text-muted mb-2">{employee.jobTitle || 'Employee'}</p>
        <EmployeeStatusBadge status={employee.status} />
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Employee Code</span>
            <strong>{employee.employeeCode}</strong>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Department</span>
            <span>{employee.department || 'N/A'}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Employment Type</span>
            <span>{employee.employmentType}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Hire Date</span>
            <span>{new Date(employee.hireDate).toLocaleDateString()}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Phone</span>
            <span>{employee.phoneNumber}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Email</span>
            <span>{employee.user?.email || 'N/A'}</span>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Hourly Rate</span>
            <strong>${employee.hourlyRate?.toFixed(2)}/hr</strong>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Commission Eligible</span>
            <span>
              {employee.isEligibleForCommission ? (
                <i className="fas fa-check-circle text-success"></i>
              ) : (
                <i className="fas fa-times-circle text-danger"></i>
              )}
            </span>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};
