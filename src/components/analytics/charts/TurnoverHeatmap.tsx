import React from 'react';
import type { ProductTurnover, TurnoverClassification } from '../../../types/analytics';

interface TurnoverHeatmapProps {
  products: ProductTurnover[];
  title?: string;
}

const TurnoverHeatmap: React.FC<TurnoverHeatmapProps> = ({
  products,
  title = 'Inventory Turnover Heatmap',
}) => {
  const getColorForTurnover = (classification: TurnoverClassification): string => {
    switch (classification) {
      case 'FAST':
        return '#10b981'; // Green
      case 'NORMAL':
        return '#3b82f6'; // Blue
      case 'SLOW':
        return '#f59e0b'; // Orange
      case 'DEAD':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const getTextColorForTurnover = (classification: TurnoverClassification): string => {
    return '#ffffff'; // White text for all
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        <div className="d-flex flex-wrap gap-2">
          {products.slice(0, 50).map((product, index) => (
            <div
              key={`${product.productId}-${index}`}
              className="position-relative"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: getColorForTurnover(product.classification),
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                cursor: 'pointer',
              }}
              title={`${product.productName}\nTurnover: ${product.turnoverRatio.toFixed(2)}\nDays to Sell: ${product.daysToSell}\nClassification: ${product.classification}`}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: getTextColorForTurnover(product.classification),
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  fontWeight: 'bold',
                }}
              >
                {product.productName.substring(0, 10)}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: getTextColorForTurnover(product.classification),
                  fontWeight: 'bold',
                  marginTop: '4px',
                }}
              >
                {product.turnoverRatio.toFixed(1)}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: getTextColorForTurnover(product.classification),
                }}
              >
                {product.daysToSell}d
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 d-flex gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
            <small>Fast Moving</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
            <small>Normal</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
            <small>Slow Moving</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
            <small>Dead Stock</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnoverHeatmap;
