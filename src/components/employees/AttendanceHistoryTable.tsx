import React, { useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchShiftsByEmployeeRequest } from '../../store/employees/shiftsSlice';
import { ShiftStatus } from '../../services/shiftService';

interface AttendanceHistoryTableProps {
  employeeId: string;
}

export const AttendanceHistoryTable: React.FC<AttendanceHistoryTableProps> = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { shifts, isLoading } = useSelector((state: RootState) => state.shifts);

  useEffect(() => {
    dispatch(fetchShiftsByEmployeeRequest({ employeeId, page: 1, pageSize: 20 }));
  }, [dispatch, employeeId]);

  const getStatusVariant = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.Completed:
        return 'success';
      case ShiftStatus.InProgress:
        return 'primary';
      case ShiftStatus.Cancelled:
        return 'danger';
      case ShiftStatus.NoShow:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const calculateHours = (start?: string, end?: string) => {
    if (!start || !end) return '-';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return (diff / (1000 * 60 * 60)).toFixed(2);
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
          <th>Scheduled</th>
          <th>Actual</th>
          <th>Hours</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {shifts.map(shift => (
          <tr key={shift.id}>
            <td>{new Date(shift.scheduledStartTime).toLocaleDateString()}</td>
            <td>
              {new Date(shift.scheduledStartTime).toLocaleTimeString()} -{' '}
              {new Date(shift.scheduledEndTime).toLocaleTimeString()}
            </td>
            <td>
              {shift.actualStartTime && new Date(shift.actualStartTime).toLocaleTimeString()}
              {shift.actualEndTime && ` - ${new Date(shift.actualEndTime).toLocaleTimeString()}`}
            </td>
            <td>{calculateHours(shift.actualStartTime, shift.actualEndTime)}</td>
            <td>
              <Badge variant={getStatusVariant(shift.status)}>{shift.status}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
