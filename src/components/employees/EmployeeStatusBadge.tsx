import React from 'react';
import { Badge } from 'react-bootstrap';
import { EmploymentStatus } from '../../services/employeeProfileService';

interface EmployeeStatusBadgeProps {
  status: EmploymentStatus;
}

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case EmploymentStatus.Active:
        return 'success';
      case EmploymentStatus.OnLeave:
        return 'warning';
      case EmploymentStatus.Suspended:
        return 'danger';
      case EmploymentStatus.Terminated:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant()}>
      {status}
    </Badge>
  );
};
