import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchMetricsByEmployeeRequest } from '../../store/employees/performanceSlice';
import { MetricPeriodType } from '../../services/performanceService';

interface PerformanceMetricsCardProps {
  employeeId: string;
}

export const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ employeeId }) => {
  const dispatch = useDispatch();
  const { metrics, isLoading } = useSelector((state: RootState) => state.performance);

  useEffect(() => {
    dispatch(fetchMetricsByEmployeeRequest({
      employeeId,
      periodType: MetricPeriodType.Monthly,
      page: 1,
      pageSize: 1
    }));
  }, [dispatch, employeeId]);

  const latestMetric = metrics[0];

  if (isLoading) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!latestMetric) {
    return (
      <div className="text-center text-muted p-3">
        <p>No performance data available</p>
      </div>
    );
  }

  const metrics_list = [
    { label: 'Total Sales', value: `$${latestMetric.totalSales.toFixed(2)}`, icon: 'fa-dollar-sign', color: 'success' },
    { label: 'Orders Processed', value: latestMetric.ordersProcessed, icon: 'fa-shopping-cart', color: 'primary' },
    { label: 'Avg Order Value', value: `$${latestMetric.averageOrderValue.toFixed(2)}`, icon: 'fa-chart-line', color: 'info' },
    { label: 'Hours Worked', value: latestMetric.totalHoursWorked.toFixed(1), icon: 'fa-clock', color: 'warning' },
    { label: 'Performance Score', value: `${latestMetric.performanceScore.toFixed(0)}/100`, icon: 'fa-star', color: 'warning' },
    { label: 'Performance Grade', value: latestMetric.performanceGrade || 'N/A', icon: 'fa-award', color: 'danger' },
  ];

  return (
    <div>
      <h5 className="mb-3">Performance Overview</h5>
      <Row>
        {metrics_list.map((metric, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className={`mr-3 text-${metric.color}`}>
                    <i className={`fas ${metric.icon} fa-2x`}></i>
                  </div>
                  <div>
                    <div className="text-muted small">{metric.label}</div>
                    <div className="h5 mb-0">{metric.value}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
