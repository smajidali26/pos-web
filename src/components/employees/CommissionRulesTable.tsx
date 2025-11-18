import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  activateCommissionRequest,
  deactivateCommissionRequest
} from '../../store/employees/commissionsSlice';
import { Commission } from '../../services/commissionService';

export const CommissionRulesTable: React.FC = () => {
  const dispatch = useDispatch();
  const { commissions, isLoading } = useSelector((state: RootState) => state.commissions);

  const handleToggleStatus = (commission: Commission) => {
    if (commission.isActive) {
      dispatch(deactivateCommissionRequest(commission.id));
    } else {
      dispatch(activateCommissionRequest(commission.id));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Basis</th>
          <th>Rate</th>
          <th>Status</th>
          <th>Effective From</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {commissions.map(commission => (
          <tr key={commission.id}>
            <td>
              <strong>{commission.name}</strong>
              <br />
              <small className="text-muted">{commission.description}</small>
            </td>
            <td>{commission.commissionType}</td>
            <td>{commission.commissionBasis}</td>
            <td>
              {commission.rate}
              {commission.commissionType === 'Percentage' ? '%' : ' $'}
            </td>
            <td>
              <Badge variant={commission.isActive ? 'success' : 'secondary'}>
                {commission.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </td>
            <td>{new Date(commission.effectiveFrom).toLocaleDateString()}</td>
            <td>
              <Button
                variant={commission.isActive ? 'warning' : 'success'}
                size="sm"
                onClick={() => handleToggleStatus(commission)}
              >
                {commission.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
