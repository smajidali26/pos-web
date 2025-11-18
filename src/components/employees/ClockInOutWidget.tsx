import React, { useEffect } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchActiveShiftsRequest } from '../../store/employees/shiftsSlice';
import { ShiftStatus } from '../../services/shiftService';

export const ClockInOutWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { activeShifts, isLoading } = useSelector((state: RootState) => state.shifts);

  useEffect(() => {
    dispatch(fetchActiveShiftsRequest({}));
    const interval = setInterval(() => {
      dispatch(fetchActiveShiftsRequest({}));
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <Card className="mb-3">
      <Card.Header>
        <h5 className="mb-0">
          <i className="fas fa-clock mr-2"></i>
          Currently Clocked In
        </h5>
      </Card.Header>
      <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {isLoading ? (
          <div className="text-center p-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : activeShifts.length > 0 ? (
          <ListGroup variant="flush">
            {activeShifts.map(shift => (
              <ListGroup.Item key={shift.id} className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="font-weight-bold">
                      {shift.employeeProfile?.user?.firstName} {shift.employeeProfile?.user?.lastName}
                    </div>
                    <small className="text-muted">
                      Since {new Date(shift.actualStartTime!).toLocaleTimeString()}
                    </small>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center text-muted p-3">
            <i className="fas fa-user-clock fa-2x mb-2"></i>
            <p className="mb-0">No employees clocked in</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
