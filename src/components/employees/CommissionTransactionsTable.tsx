import React, { useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactionsRequest } from '../../store/employees/commissionsSlice';
import { CommissionStatus } from '../../services/commissionService';

interface CommissionTransactionsTableProps {
  employeeId: string;
}

export const CommissionTransactionsTable: React.FC<CommissionTransactionsTableProps> = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector((state: RootState) => state.commissions);

  useEffect(() => {
    dispatch(fetchTransactionsRequest({ employeeId, page: 1, pageSize: 20 }));
  }, [dispatch, employeeId]);

  const getStatusVariant = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.Pending:
        return 'warning';
      case CommissionStatus.Approved:
        return 'info';
      case CommissionStatus.Paid:
        return 'success';
      case CommissionStatus.Voided:
        return 'danger';
      default:
        return 'secondary';
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
          <th>Date</th>
          <th>Order ID</th>
          <th>Sale Amount</th>
          <th>Commission</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.id}>
            <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
            <td>{transaction.orderId.substring(0, 8)}...</td>
            <td>${transaction.saleAmount.toFixed(2)}</td>
            <td>
              <strong>${transaction.commissionAmount.toFixed(2)}</strong>
            </td>
            <td>
              <Badge variant={getStatusVariant(transaction.status)}>
                {transaction.status}
              </Badge>
            </td>
          </tr>
        ))}
        {transactions.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center text-muted">
              No commission transactions found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
