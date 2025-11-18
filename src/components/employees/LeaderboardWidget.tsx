import React, { useEffect } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchTopPerformersRequest } from '../../store/employees/performanceSlice';

export const LeaderboardWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { topPerformers, isLoading } = useSelector((state: RootState) => state.performance);

  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    dispatch(fetchTopPerformersRequest({
      periodStart: firstDay.toISOString(),
      periodEnd: lastDay.toISOString(),
      count: 5
    }));
  }, [dispatch]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'warning'; // Gold
      case 2:
        return 'secondary'; // Silver
      case 3:
        return 'danger'; // Bronze
      default:
        return 'primary';
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="fas fa-trophy mr-2"></i>
          Top Performers
        </h5>
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <div className="text-center p-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : topPerformers.length > 0 ? (
          <ListGroup variant="flush">
            {topPerformers.map(performer => (
              <ListGroup.Item key={performer.employeeProfileId} className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Badge
                      variant={getMedalColor(performer.rank)}
                      className="mr-2"
                      style={{ width: '24px', height: '24px', borderRadius: '50%', padding: '4px' }}
                    >
                      {performer.rank}
                    </Badge>
                    <div>
                      <div className="font-weight-bold">{performer.employeeName}</div>
                      <small className="text-muted">
                        ${performer.totalSales.toFixed(0)} sales
                      </small>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-weight-bold">{performer.performanceScore.toFixed(0)}</div>
                    <small className="text-muted">{performer.performanceGrade}</small>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center text-muted p-3">
            <i className="fas fa-medal fa-2x mb-2"></i>
            <p className="mb-0">No performance data available</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
