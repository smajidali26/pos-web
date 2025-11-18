import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap';
import { useAnalytics } from '../../hooks/useAnalytics';

const InventoryHealthDashboard: React.FC = () => {
  const {
    inventoryAnalytics,
    inventoryAnalyticsLoading,
    inventoryAnalyticsError,
    fetchInventoryAnalytics,
    reorderRecommendations,
    fetchReorderRecommendations,
  } = useAnalytics();

  const [storeId, setStoreId] = useState<string>('');

  useEffect(() => {
    fetchInventoryAnalytics(storeId || undefined);
    fetchReorderRecommendations(storeId || undefined);
  }, [storeId, fetchInventoryAnalytics, fetchReorderRecommendations]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const getUrgencyBadge = (level: string) => {
    const variants: Record<string, string> = {
      critical: 'danger',
      high: 'warning',
      medium: 'info',
      low: 'secondary',
    };
    return <Badge bg={variants[level]}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Inventory Health Dashboard</h1>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {inventoryAnalyticsLoading && !inventoryAnalytics ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : inventoryAnalyticsError ? (
            <div className="alert alert-danger">{inventoryAnalyticsError}</div>
          ) : inventoryAnalytics ? (
            <>
              {/* KPI Cards */}
              <Row className="mb-4">
                <Col md={3}>
                  <Card>
                    <Card.Body>
                      <h6 className="text-muted">Total Inventory Value</h6>
                      <h3>${inventoryAnalytics.totalInventoryValue.toLocaleString()}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card>
                    <Card.Body>
                      <h6 className="text-muted">Avg Turnover Rate</h6>
                      <h3>{inventoryAnalytics.avgTurnoverRate.toFixed(2)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card>
                    <Card.Body>
                      <h6 className="text-muted">Health Score</h6>
                      <h3>{inventoryAnalytics.inventoryHealthScore.toFixed(0)}%</h3>
                      <ProgressBar
                        now={inventoryAnalytics.inventoryHealthScore}
                        variant={getHealthScoreColor(inventoryAnalytics.inventoryHealthScore)}
                        className="mt-2"
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card>
                    <Card.Body>
                      <h6 className="text-muted">Dead Stock</h6>
                      <h3>{inventoryAnalytics.deadStockPercentage.toFixed(1)}%</h3>
                      <small className="text-muted">Of total inventory</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Overstocked Items */}
              <Card className="mb-4">
                <Card.Header>
                  <Card.Title>Overstocked Items</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th className="text-end">Current Stock</th>
                        <th className="text-end">Optimal Stock</th>
                        <th className="text-end">Excess Qty</th>
                        <th className="text-end">Tied Up Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryAnalytics.overstockedItems.slice(0, 10).map(item => (
                        <tr key={item.productId}>
                          <td>{item.productName}</td>
                          <td>{item.sku}</td>
                          <td className="text-end">{item.currentStock}</td>
                          <td className="text-end">{item.optimalStock}</td>
                          <td className="text-end text-warning">{item.excessQuantity}</td>
                          <td className="text-end">${item.tiedUpValue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Reorder Recommendations */}
              <Card>
                <Card.Header>
                  <Card.Title>Reorder Recommendations</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Table striped hover responsive>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th className="text-end">Current Stock</th>
                        <th className="text-end">Reorder Point</th>
                        <th className="text-end">Recommended Qty</th>
                        <th>Urgency</th>
                        <th>Est. Stockout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reorderRecommendations.slice(0, 10).map(rec => (
                        <tr key={rec.productId}>
                          <td>{rec.productName}</td>
                          <td>{rec.sku}</td>
                          <td className="text-end">{rec.currentStock}</td>
                          <td className="text-end">{rec.reorderPoint}</td>
                          <td className="text-end">{rec.recommendedOrderQty}</td>
                          <td>{getUrgencyBadge(rec.urgencyLevel)}</td>
                          <td>{new Date(rec.estimatedStockoutDate).toLocaleDateString()}</td>
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

export default InventoryHealthDashboard;
