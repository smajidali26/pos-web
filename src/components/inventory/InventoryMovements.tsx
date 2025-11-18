import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FaHistory, FaFilter, FaDownload } from 'react-icons/fa';
import inventoryService, { InventoryMovement } from '../../services/inventoryService';
import { formatDate } from '../../utils/dateUtils';
import { getErrorMessage } from '../../types/api';

const InventoryMovements: React.FC = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    productId: '',
    locationId: '',
    movementType: '',
    startDate: '',
    endDate: '',
    page: 1,
    pageSize: 50
  });

  useEffect(() => {
    loadMovements();
  }, [filters]);

  const loadMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getInventoryMovements(filters);
      setMovements(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getMovementTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      'StockIn': 'success',
      'StockOut': 'danger',
      'Adjustment': 'warning',
      'Transfer': 'info',
      'Return': 'primary',
      'Damage': 'danger',
      'Theft': 'danger',
      'Expiry': 'secondary'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      productId: '',
      locationId: '',
      movementType: '',
      startDate: '',
      endDate: '',
      page: 1,
      pageSize: 50
    });
  };

  return (
    <div className="inventory-movements">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><FaHistory className="me-2" />Inventory Movement History</h2>
          <p className="text-muted">Track all stock movements and changes</p>
        </div>
        <Button variant="outline-primary" onClick={() => window.print()}>
          <FaDownload className="me-2" />Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Header>
          <FaFilter className="me-2" />Filters
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Movement Type</Form.Label>
                <Form.Select
                  value={filters.movementType}
                  onChange={(e) => handleFilterChange('movementType', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="StockIn">Stock In</option>
                  <option value="StockOut">Stock Out</option>
                  <option value="Adjustment">Adjustment</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Return">Return</option>
                  <option value="Damage">Damage</option>
                  <option value="Theft">Theft</option>
                  <option value="Expiry">Expiry</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100 mb-3">
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span>Movement History ({movements.length} records)</span>
            <Badge bg="secondary">{filters.movementType || 'All Types'}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaHistory size={48} className="mb-3 opacity-25" />
              <p>No movements found</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Location</th>
                  <th>Reason</th>
                  <th>User</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{formatDate(movement.movementDate)}</td>
                    <td>
                      <div>
                        <strong>{movement.productName}</strong>
                        <br />
                        <small className="text-muted">{movement.productSKU}</small>
                      </div>
                    </td>
                    <td>{getMovementTypeBadge(movement.type)}</td>
                    <td>
                      <Badge bg={
                        movement.type === 'StockIn' || movement.type === 'Return' ? 'success' : 'danger'
                      }>
                        {movement.type === 'StockIn' || movement.type === 'Return' ? '+' : '-'}
                        {movement.quantity}
                      </Badge>
                    </td>
                    <td>{movement.previousQuantity}</td>
                    <td>
                      <strong>{movement.newQuantity}</strong>
                    </td>
                    <td>
                      {movement.locationName ? (
                        <Badge bg="info">{movement.locationName}</Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <small>{movement.reason || '-'}</small>
                    </td>
                    <td>
                      <small>{movement.movedByUser}</small>
                    </td>
                    <td>
                      {movement.referenceNumber ? (
                        <small className="font-monospace">{movement.referenceNumber}</small>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default InventoryMovements;
