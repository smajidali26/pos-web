import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchTrendsRequest } from '../../store/employees/performanceSlice';
import { MetricPeriodType } from '../../services/performanceService';

interface PerformanceTrendChartProps {
  employeeId: string;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { trends, isLoading } = useSelector((state: RootState) => state.performance);

  useEffect(() => {
    dispatch(fetchTrendsRequest({
      employeeId,
      periodType: MetricPeriodType.Monthly,
      periodsCount: 6
    }));
  }, [dispatch, employeeId]);

  if (isLoading) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // This is a placeholder component
  // In a real implementation, you would use a charting library to visualize trends

  return (
    <div className="text-center p-5">
      <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
      <p className="text-muted">
        Performance trend chart would be displayed here
      </p>
      <small className="text-muted">
        Showing {trends.length} periods of data
      </small>
    </div>
  );
};
