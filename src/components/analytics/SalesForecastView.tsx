import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ForecastLineChart } from './charts';
import { ForecastMethod } from '../../types/analytics';
import ANALYTICS_CONFIG from '../../config/analyticsConfig';

const SalesForecastView: React.FC = () => {
  const {
    forecasts,
    forecastsLoading,
    forecastsError,
    fetchSalesForecast,
    generateForecasts,
  } = useAnalytics();

  const [productId, setProductId] = useState<string>('');
  const [forecastDays, setForecastDays] = useState<number>(30);
  const [method, setMethod] = useState<ForecastMethod>(ForecastMethod.AUTO);

  const handleGenerateForecast = () => {
    if (productId) {
      fetchSalesForecast({ productId, forecastDays, method });
    } else {
      generateForecasts({ forecastDays, method });
    }
  };

  const currentForecast = forecasts.length > 0 ? forecasts[0] : null;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Sales Forecast</h1>
        </div>
      </div>

      <div className="content">
        <div className="container-fluid">
          {/* Controls */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Forecast Period</Form.Label>
                    <Form.Select value={forecastDays} onChange={(e) => setForecastDays(Number(e.target.value))}>
                      <option value={7}>7 Days</option>
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Method</Form.Label>
                    <Form.Select value={method} onChange={(e) => setMethod(e.target.value as ForecastMethod)}>
                      {ANALYTICS_CONFIG.FORECAST.METHODS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Product (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Leave empty for all products"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    variant="primary"
                    onClick={handleGenerateForecast}
                    disabled={forecastsLoading}
                  >
                    {forecastsLoading ? 'Generating...' : 'Generate Forecast'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {forecastsError && (
            <div className="alert alert-danger">{forecastsError}</div>
          )}

          {forecastsLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-3">Generating forecast...</p>
            </div>
          )}

          {currentForecast && !forecastsLoading && (
            <>
              {/* Forecast Chart */}
              <Card className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title>
                      {currentForecast.productName || 'Overall Sales'} Forecast
                    </Card.Title>
                    <Badge bg="info">{currentForecast.method}</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <ForecastLineChart data={currentForecast.forecastData} height={400} />
                </Card.Body>
              </Card>

              {/* Accuracy Metrics */}
              <Card>
                <Card.Header>
                  <Card.Title>Forecast Accuracy Metrics</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="text-center p-3">
                        <h4>{(currentForecast.accuracy.mape * 100).toFixed(2)}%</h4>
                        <p className="text-muted mb-0">MAPE (Mean Absolute Percentage Error)</p>
                        <small>Lower is better</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center p-3">
                        <h4>{currentForecast.accuracy.rmse.toFixed(2)}</h4>
                        <p className="text-muted mb-0">RMSE (Root Mean Square Error)</p>
                        <small>Lower is better</small>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center p-3">
                        <h4>{(currentForecast.accuracy.r2 * 100).toFixed(2)}%</h4>
                        <p className="text-muted mb-0">R-Squared</p>
                        <small>Higher is better</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}

          {!currentForecast && !forecastsLoading && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-graph-up" style={{ fontSize: '4rem' }}></i>
              <p className="mt-3">Generate a forecast to see predictions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesForecastView;
