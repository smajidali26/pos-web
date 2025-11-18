import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, InputGroup } from 'react-bootstrap';
import { useStores } from '../../hooks/useStores';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';

export const StoreInventory: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { storeInventory, isLoading, error, fetchStoreInventory } = useStores();

  const [filterType, setFilterType] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (storeId) {
      fetchStoreInventory(storeId);
    }
  }, [storeId, fetchStoreInventory]);

  const filteredItems = storeInventory?.items.filter(item => {
    const matchesSearch = !searchTerm ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' ||
      (filterType === 'low-stock' && item.isLowStock && !item.isOutOfStock) ||
      (filterType === 'out-of-stock' && item.isOutOfStock);

    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Store Inventory</h2>
              {storeInventory && (
                <p className="text-muted mb-0">{storeInventory.storeName}</p>
              )}
            </div>
            <Button variant="outline-primary" onClick={() => navigate('/stores')}>
              <i className="bi bi-arrow-left me-1"></i>
              Back to Stores
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </Col>
        </Row>
      )}

      {storeInventory && (
        <Row className="mb-3">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Items</h6>
                <h3 className="mb-0">{storeInventory.totalItems}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Value</h6>
                <h3 className="mb-0">{formatCurrency(storeInventory.totalValue)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-warning">
              <Card.Body>
                <h6 className="text-muted mb-2">Low Stock</h6>
                <h3 className="mb-0 text-warning">{storeInventory.lowStockCount}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-danger">
              <Card.Body>
                <h6 className="text-muted mb-2">Out of Stock</h6>
                <h3 className="mb-0 text-danger">{storeInventory.outOfStockCount}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                  >
                    <option value="all">All Products</option>
                    <option value="low-stock">Low Stock Only</option>
                    <option value="out-of-stock">Out of Stock Only</option>
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Level</th>
                    <th>Reorder Level</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.productId}>
                        <td>{item.sku}</td>
                        <td>{item.productName}</td>
                        <td>{item.categoryName}</td>
                        <td className="text-center">
                          <strong>{item.currentStock}</strong>
                        </td>
                        <td className="text-center">{item.minStockLevel}</td>
                        <td className="text-center">{item.reorderLevel}</td>
                        <td>{formatCurrency(item.inventoryValue)}</td>
                        <td>
                          {item.isOutOfStock ? (
                            <Badge bg="danger">Out of Stock</Badge>
                          ) : item.isLowStock ? (
                            <Badge bg="warning" text="dark">Low Stock</Badge>
                          ) : (
                            <Badge bg="success">In Stock</Badge>
                          )}
                        </td>
                        <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StoreInventory;
