import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { PaymentMethodStats } from '../../../types/analytics';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethodPieChartProps {
  paymentMethods: PaymentMethodStats[];
  title?: string;
  height?: number;
}

const PaymentMethodPieChart: React.FC<PaymentMethodPieChartProps> = ({
  paymentMethods,
  title = 'Payment Methods Distribution',
  height = 300,
}) => {
  const colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
  ];

  const chartData = {
    labels: paymentMethods.map(pm => pm.method),
    datasets: [
      {
        label: 'Amount',
        data: paymentMethods.map(pm => pm.amount),
        backgroundColor: colors.slice(0, paymentMethods.length),
        borderColor: colors.slice(0, paymentMethods.length).map(c => c.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PaymentMethodPieChart;
