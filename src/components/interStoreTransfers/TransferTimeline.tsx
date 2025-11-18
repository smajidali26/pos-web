import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import interStoreTransfersService from '../../services/interStoreTransfersService';
import { TransferTimeline as TimelineType, TransferStatus } from '../../types/interStoreTransfer';

interface TransferTimelineProps {
  transferId: string;
}

export const TransferTimeline: React.FC<TransferTimelineProps> = ({ transferId }) => {
  const [timeline, setTimeline] = useState<TimelineType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTimeline();
  }, [transferId]);

  const loadTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await interStoreTransfersService.getTransferTimeline(transferId);
      setTimeline(data);
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: TransferStatus) => {
    const icons: Record<TransferStatus, string> = {
      [TransferStatus.DRAFT]: 'bi-file-earmark-text',
      [TransferStatus.PENDING]: 'bi-clock-history',
      [TransferStatus.APPROVED]: 'bi-check-circle',
      [TransferStatus.REJECTED]: 'bi-x-circle',
      [TransferStatus.IN_TRANSIT]: 'bi-truck',
      [TransferStatus.COMPLETED]: 'bi-check-circle-fill',
      [TransferStatus.CANCELLED]: 'bi-slash-circle'
    };
    return icons[status] || 'bi-circle';
  };

  const getStatusColor = (status: TransferStatus) => {
    const colors: Record<TransferStatus, string> = {
      [TransferStatus.DRAFT]: 'secondary',
      [TransferStatus.PENDING]: 'warning',
      [TransferStatus.APPROVED]: 'info',
      [TransferStatus.REJECTED]: 'danger',
      [TransferStatus.IN_TRANSIT]: 'primary',
      [TransferStatus.COMPLETED]: 'success',
      [TransferStatus.CANCELLED]: 'dark'
    };
    return colors[status] || 'secondary';
  };

  if (isLoading) {
    return (
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Timeline</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (timeline.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2"></i>
          Timeline
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="timeline">
          {timeline.map((item, index) => (
            <div key={index} className="timeline-item mb-3">
              <div className="d-flex">
                <div className="me-3">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `var(--bs-${getStatusColor(item.status)})`,
                      color: 'white'
                    }}
                  >
                    <i className={`bi ${getStatusIcon(item.status)}`}></i>
                  </div>
                  {index < timeline.length - 1 && (
                    <div
                      className="ms-2"
                      style={{
                        width: '2px',
                        height: '40px',
                        backgroundColor: '#dee2e6',
                        marginLeft: '19px'
                      }}
                    ></div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <strong>{item.status}</strong>
                    <small className="text-muted">
                      {new Date(item.timestamp).toLocaleString()}
                    </small>
                  </div>
                  {item.performedByName && (
                    <div className="text-muted small">
                      By: {item.performedByName}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-muted small mt-1">
                      <em>{item.notes}</em>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransferTimeline;
