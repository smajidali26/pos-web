import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Shift, ShiftStatus } from '../../services/shiftService';
import { clockInRequest, clockOutRequest } from '../../store/employees/shiftsSlice';

interface ShiftCardProps {
  shift: Shift;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const dispatch = useDispatch();

  const getStatusVariant = () => {
    switch (shift.status) {
      case ShiftStatus.Scheduled:
        return 'primary';
      case ShiftStatus.InProgress:
        return 'success';
      case ShiftStatus.Completed:
        return 'info';
      case ShiftStatus.Cancelled:
        return 'danger';
      case ShiftStatus.NoShow:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleClockIn = () => {
    dispatch(clockInRequest({ id: shift.id }));
  };

  const handleClockOut = () => {
    dispatch(clockOutRequest({ id: shift.id }));
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-0">
              {shift.employeeProfile?.user?.firstName} {shift.employeeProfile?.user?.lastName}
            </h6>
            <small className="text-muted">{shift.employeeProfile?.employeeCode}</small>
          </div>
          <Badge variant={getStatusVariant()}>{shift.status}</Badge>
        </div>

        <div className="mb-2">
          <div className="small text-muted">Date</div>
          <div>{formatDate(shift.scheduledStartTime)}</div>
        </div>

        <div className="mb-2">
          <div className="small text-muted">Scheduled Time</div>
          <div>
            {formatTime(shift.scheduledStartTime)} - {formatTime(shift.scheduledEndTime)}
          </div>
        </div>

        {shift.actualStartTime && (
          <div className="mb-2">
            <div className="small text-muted">Actual Time</div>
            <div>
              {formatTime(shift.actualStartTime)}
              {shift.actualEndTime && ` - ${formatTime(shift.actualEndTime)}`}
            </div>
          </div>
        )}

        {shift.status === ShiftStatus.Scheduled && (
          <Button variant="success" size="sm" className="w-100" onClick={handleClockIn}>
            <i className="fas fa-clock mr-1"></i> Clock In
          </Button>
        )}

        {shift.status === ShiftStatus.InProgress && (
          <Button variant="danger" size="sm" className="w-100" onClick={handleClockOut}>
            <i className="fas fa-clock mr-1"></i> Clock Out
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};
