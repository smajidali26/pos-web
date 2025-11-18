import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Table, Badge, Button } from 'react-bootstrap';
import { useAnalytics } from '../../hooks/useAnalytics';
import { TurnoverHeatmap } from './charts';
import { TurnoverClassification } from '../../types/analytics';

const InventoryTurnoverView: React.FC = () => {
  const { turnover, turnoverLoading, turnoverError, fetchInventoryTurnover } = useAnalytics();

  const [periodDays, setPeriodDays] = useState<number>(90);
  const [storeId, setStoreId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<TurnoverClassification | 'ALL'>('ALL');

  useEffect(() => {
    fetchInventoryTurnover({
      periodDays,
      storeId: storeId || undefined,
      categoryId: categoryId || undefined,
    });
  }, [periodDays, storeId, categoryId, fetchInventoryTurnover]);

  const getFilteredProducts = () => {
    if (!turnover) return [];
    if (classificationFilter === 'ALL') return turnover.products;
    return turnover.products.filter(p => p.classification === classificationFilter);
  };

  const getClassificationBadge = (classification: TurnoverClassification) => {
    const variants = {
      FAST: 'success',
      NORMAL: 'info',
      SLOW: 'warning',
      DEAD: 'danger',
    };
    return <Badge bg={variants[classification]}>{classification}</Badge>;
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Inventory Turnover Analysis</h1>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Period</Form.Label>
                    <Form.Select value={periodDays} onChange={(e) => setPeriodDays(Number(e.target.value))}>
                      <option value={30}>Last 30 Days</option>
                      <option value={60}>Last 60 Days</option>
                      <option value={90}>Last 90 Days</option>
                      <option value={180}>Last 180 Days</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Classification</Form.Label>
                    <Form.Select value={classificationFilter} onChange={(e) => setClassificationFilter(e.target.value as TurnoverClassification | 'ALL')}>
                      <option value="ALL">All</option>
                      <option value="FAST">Fast Moving</option>
                      <option value="NORMAL">Normal</option>
                      <option value="SLOW">Slow Moving</option>
                      <option value="DEAD">Dead Stock</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {turnoverLoading && !turnover ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : turnoverError ? (
            <div className="alert alert-danger">{turnoverError}</div>
          ) : turnover ? (
            <>
              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="bg-success text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Fast Moving</h6>
                      <h3>{turnover.summary.fastMoving}</h3>
                      <small>High turnover products</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-info text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Normal</h6>
                      <h3>{turnover.summary.normal}</h3>
                      <small>Average turnover</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-warning text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Slow Moving</h6>
                      <h3>{turnover.summary.slowMoving}</h3>
                      <small>Low turnover items</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="bg-danger text-white">
                    <Card.Body>
                      <h6 className="text-white-50">Dead Stock</h6>
                      <h3>{turnover.summary.deadStock}</h3>
                      <small>No movement</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Heatmap */}
              <div className="mb-4">
                <TurnoverHeatmap products={turnover.products} />
              </div>

              {/* Products Table */}
              <Card>
                <Card.Header>
                  <Card.Title>Product Turnover Details ({getFilteredProducts().length} products)</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th className="text-end">Avg Inventory</th>
                        <th className="text-end">COGS</th>
                        <th className="text-end">Turnover Ratio</th>
                        <th className="text-end">Days to Sell</th>
                        <th>Classification</th>
                        <th>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredProducts().map(product => (
                        <tr key={product.productId}>
                          <td>{product.productName}</td>
                          <td>{product.sku}</td>
                          <td>{product.categoryName}</td>
                          <td className="text-end">{product.avgInventory.toFixed(0)}</td>
                          <td className="text-end">${product.costOfGoodsSold.toLocaleString()}</td>
                          <td className="text-end">{product.turnoverRatio.toFixed(2)}</td>
                          <td className="text-end">{product.daysToSell}</td>
                          <td>{getClassificationBadge(product.classification)}</td>
                          <td><small>{product.reorderRecommendation}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InventoryTurnoverView;
