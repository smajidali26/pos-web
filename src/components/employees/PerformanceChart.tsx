import React from 'react';
import { PerformanceMetric } from '../../services/performanceService';

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics }) => {
  // This is a placeholder component
  // In a real implementation, you would use a charting library like Chart.js or Recharts

  return (
    <div className="text-center p-5">
      <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
      <p className="text-muted">
        Performance chart visualization would be displayed here
      </p>
      <small className="text-muted">
        Showing {metrics.length} performance records
      </small>
    </div>
  );
};
