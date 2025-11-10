import React from 'react';
import { OrderHistory } from './OrderHistory';

// Main Orders component - currently just wraps OrderHistory
// Can be extended to include tabs for different views
export const Orders: React.FC = () => {
  return <OrderHistory />;
};

export default Orders;
