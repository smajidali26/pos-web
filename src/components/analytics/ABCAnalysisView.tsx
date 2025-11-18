import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table, Tabs, Tab, Badge } from 'react-bootstrap';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ABCParetoChart } from './charts';
import { ABCClass } from '../../types/analytics';
import ANALYTICS_CONFIG from '../../config/analyticsConfig';

const ABCAnalysisView: React.FC = () => {
  const {
    abcAnalysis,
    abcAnalysisLoading,
    abcAnalysisError,
    fetchABCAnalysis,
    calculateABCAnalysis,
  } = useAnalytics();

  const [periodDays, setPeriodDays] = useState<number>(90);
  const [storeId, setStoreId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchABCAnalysis({ periodDays, storeId: storeId || undefined });
  }, [periodDays, storeId, fetchABCAnalysis]);

  const handleRecalculate = () => {
    calculateABCAnalysis({ periodDays, storeId: storeId || undefined });
  };

  const getClassProducts = (className: ABCClass) => {
    return abcAnalysis?.products.filter(p => p.class === className) || [];
  };

  const getClassBadgeVariant = (className: ABCClass) => {
    switch (className) {
      case ABCClass.A: return 'success';
      case ABCClass.B: return 'warning';
      case ABCClass.C: return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>ABC Analysis</h1>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {/* Controls */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Analysis Period</Form.Label>
                    <Form.Select value={periodDays} onChange={(e) => setPeriodDays(Number(e.target.value))}>
                      <option value={30}>Last 30 Days</option>
                      <option value={60}>Last 60 Days</option>
                      <option value={90}>Last 90 Days</option>
                      <option value={180}>Last 180 Days</option>
                      <option value={365}>Last Year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Store (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="All stores"
                      value={storeId}
                      onChange={(e) => setStoreId(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button
                    variant="primary"
                    onClick={handleRecalculate}
                    disabled={abcAnalysisLoading}
                  >
                    {abcAnalysisLoading ? 'Calculating...' : 'Recalculate'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {abcAnalysisError && (
            <div className="alert alert-danger">{abcAnalysisError}</div>
          )}

          {abcAnalysisLoading && !abcAnalysis ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : abcAnalysis ? (
            <>
              {/* Summary Cards */}
              <Row className="mb-4">
                {abcAnalysis.classSummaries.map(summary => (
                  <Col md={4} key={summary.class}>
                    <Card className={`border-${getClassBadgeVariant(summary.class)}`}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-muted">Class {summary.class}</h6>
                            <h3>{summary.productCount} Products</h3>
                            <p className="mb-0">{summary.revenuePercentage.toFixed(1)}% of Revenue</p>
                            <small className="text-muted">${summary.totalRevenue.toLocaleString()}</small>
                          </div>
                          <Badge bg={getClassBadgeVariant(summary.class)} className="p-3" style={{ fontSize: '2rem' }}>
                            {summary.class}
                          </Badge>
                        </div>
                        <hr />
                        <small className="text-muted">{summary.strategy}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pareto Chart */}
              <Card className="mb-4">
                <Card.Header>
                  <Card.Title>Pareto Chart (80-15-5 Rule)</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ABCParetoChart products={abcAnalysis.products} height={400} />
                </Card.Body>
              </Card>

              {/* Product Tables */}
              <Card>
                <Card.Header>
                  <Card.Title>Product Classification</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'all')}>
                    <Tab eventKey="all" title="All Products">
                      <Table striped hover className="mt-3">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th className="text-end">Revenue</th>
                            <th className="text-end">% of Total</th>
                            <th className="text-end">Cumulative %</th>
                            <th>Class</th>
                          </tr>
                        </thead>
                        <tbody>
                          {abcAnalysis.products.slice(0, 50).map(product => (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>{product.sku}</td>
                              <td>{product.categoryName}</td>
                              <td className="text-end">${product.revenue.toLocaleString()}</td>
                              <td className="text-end">{product.revenuePercentage.toFixed(2)}%</td>
                              <td className="text-end">{product.cumulativePercentage.toFixed(2)}%</td>
                              <td>
                                <Badge bg={getClassBadgeVariant(product.class)}>{product.class}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab>
                    <Tab eventKey="A" title={`Class A (${getClassProducts(ABCClass.A).length})`}>
                      <Table striped hover className="mt-3">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th className="text-end">Revenue</th>
                            <th className="text-end">Qty Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getClassProducts(ABCClass.A).map(product => (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>{product.sku}</td>
                              <td className="text-end">${product.revenue.toLocaleString()}</td>
                              <td className="text-end">{product.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab>
                    <Tab eventKey="B" title={`Class B (${getClassProducts(ABCClass.B).length})`}>
                      <Table striped hover className="mt-3">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th className="text-end">Revenue</th>
                            <th className="text-end">Qty Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getClassProducts(ABCClass.B).map(product => (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>{product.sku}</td>
                              <td className="text-end">${product.revenue.toLocaleString()}</td>
                              <td className="text-end">{product.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab>
                    <Tab eventKey="C" title={`Class C (${getClassProducts(ABCClass.C).length})`}>
                      <Table striped hover className="mt-3">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th className="text-end">Revenue</th>
                            <th className="text-end">Qty Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getClassProducts(ABCClass.C).map(product => (
                            <tr key={product.productId}>
                              <td>{product.productName}</td>
                              <td>{product.sku}</td>
                              <td className="text-end">${product.revenue.toLocaleString()}</td>
                              <td className="text-end">{product.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ABCAnalysisView;
