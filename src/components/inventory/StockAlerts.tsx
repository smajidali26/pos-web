import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaBell, FaExclamationTriangle, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import stockAlertsService, { StockAlert } from '../../services/stockAlertsService';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/dateUtils';
import { getErrorMessage } from '../../types/api';

const StockAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<StockAlert | null>(null);
  const [actionType, setActionType] = useState<'acknowledge' | 'resolve' | 'dismiss' | null>(null);
  const [actionData, setActionData] = useState({ notes: '', reason: '', resolutionNotes: '' });
  const [filter, setFilter] = useState({ status: 'Active', severity: '', alertType: '' });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alertsData, summaryData] = await Promise.all([
        stockAlertsService.getAll(filter),
        stockAlertsService.getDashboardSummary()
      ]);
      setAlerts(alertsData);
      setSummary(summaryData);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert || !actionType) return;

    try {
      switch (actionType) {
        case 'acknowledge':
          await stockAlertsService.acknowledge(selectedAlert.id, actionData.notes);
          toast.success('Alert acknowledged');
          break;
        case 'resolve':
          await stockAlertsService.resolve(selectedAlert.id, actionData.resolutionNotes);
          toast.success('Alert resolved');
          break;
        case 'dismiss':
          await stockAlertsService.dismiss(selectedAlert.id, actionData.reason);
          toast.info('Alert dismissed');
          break;
      }
      setShowActionModal(false);
      setSelectedAlert(null);
      setActionType(null);
      setActionData({ notes: '', reason: '', resolutionNotes: '' });
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const openActionModal = (alert: StockAlert, action: typeof actionType) => {
    setSelectedAlert(alert);
    setActionType(action);
    setShowActionModal(true);
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      'Critical': 'danger',
      'High': 'warning',
      'Medium': 'info',
      'Low': 'secondary'
    };
    return <Badge bg={variants[severity] || 'secondary'}>{severity}</Badge>;
  };

  const getAlertTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      'OutOfStock': 'danger',
      'LowStock': 'warning',
      'Overstock': 'info',
      'ExpiringSoon': 'warning',
      'Expired': 'danger',
      'ReorderNeeded': 'primary',
      'StockVariance': 'warning'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type.replace(/([A-Z])/g, ' $1').trim()}</Badge>;
  };

  return (
    <div className="stock-alerts">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaBell className="me-2" />Stock Alerts</h2>
          <p className="text-muted">Monitor and manage inventory alerts</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-danger">
              <Card.Body>
                <h3 className="text-danger">{summary.criticalAlerts}</h3>
                <small className="text-muted">Critical Alerts</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <h3 className="text-warning">{summary.highPriorityAlerts}</h3>
                <small className="text-muted">High Priority</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-info">
              <Card.Body>
                <h3>{summary.totalActiveAlerts}</h3>
                <small className="text-muted">Total Active</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-secondary">
              <Card.Body>
                <h3 className="text-secondary">{summary.overdueAlerts}</h3>
                <small className="text-muted">Overdue (>7 days)</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Dismissed">Dismissed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Severity</Form.Label>
                <Form.Select
                  value={filter.severity}
                  onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                >
                  <option value="">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Alert Type</Form.Label>
                <Form.Select
                  value={filter.alertType}
                  onChange={(e) => setFilter({ ...filter, alertType: e.target.value })}
                >
                  <option value="">All Types</option>
                  <option value="OutOfStock">Out of Stock</option>
                  <option value="LowStock">Low Stock</option>
                  <option value="Overstock">Overstock</option>
                  <option value="ExpiringSoon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Alerts Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaBell size={48} className="mb-3 opacity-25" />
              <p>No alerts found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Current / Threshold</th>
                  <th>Severity</th>
                  <th>Location</th>
                  <th>Triggered</th>
                  <th>Days Active</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className={alert.isOverdue ? 'table-warning' : ''}>
                    <td>
                      <strong>{alert.productName}</strong>
                      <br />
                      <small className="text-muted">{alert.productSKU}</small>
                    </td>
                    <td>{getAlertTypeBadge(alert.alertType)}</td>
                    <td>
                      <Badge bg={alert.currentQuantity === 0 ? 'danger' : 'warning'}>
                        {alert.currentQuantity}
                      </Badge>
                      {' / '}
                      <span>{alert.thresholdQuantity}</span>
                    </td>
                    <td>{getSeverityBadge(alert.severity)}</td>
                    <td>
                      {alert.locationName ? (
                        <Badge bg="info">{alert.locationName}</Badge>
                      ) : (
                        <span className="text-muted">All</span>
                      )}
                    </td>
                    <td>
                      <small>{formatDate(alert.triggeredDate)}</small>
                    </td>
                    <td>
                      <Badge bg={alert.isOverdue ? 'danger' : 'secondary'}>
                        {alert.daysActive} days
                        {alert.isOverdue && ' (Overdue)'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={
                        alert.status === 'Active' ? 'warning' :
                        alert.status === 'Acknowledged' ? 'info' :
                        alert.status === 'Resolved' ? 'success' : 'secondary'
                      }>
                        {alert.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {alert.status === 'Active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => openActionModal(alert, 'acknowledge')}
                              title="Acknowledge"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => openActionModal(alert, 'resolve')}
                              title="Resolve"
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => openActionModal(alert, 'dismiss')}
                              title="Dismiss"
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                        {alert.status === 'Acknowledged' && (
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => openActionModal(alert, 'resolve')}
                          >
                            <FaCheck /> Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Action Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'acknowledge' && 'Acknowledge Alert'}
            {actionType === 'resolve' && 'Resolve Alert'}
            {actionType === 'dismiss' && 'Dismiss Alert'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAction}>
          <Modal.Body>
            {selectedAlert && (
              <Alert variant="info">
                <strong>{selectedAlert.productName}</strong>
                <br />
                {selectedAlert.alertType}: {selectedAlert.currentQuantity} / {selectedAlert.thresholdQuantity}
              </Alert>
            )}

            {actionType === 'acknowledge' && (
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={actionData.notes}
                  onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                  placeholder="Add acknowledgment notes (optional)..."
                />
              </Form.Group>
            )}

            {actionType === 'resolve' && (
              <Form.Group className="mb-3">
                <Form.Label>Resolution Notes *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={actionData.resolutionNotes}
                  onChange={(e) => setActionData({ ...actionData, resolutionNotes: e.target.value })}
                  placeholder="Describe how the alert was resolved..."
                />
              </Form.Group>
            )}

            {actionType === 'dismiss' && (
              <Form.Group className="mb-3">
                <Form.Label>Dismiss Reason *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={actionData.reason}
                  onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                  placeholder="Reason for dismissing this alert..."
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowActionModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Confirm</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StockAlerts;
