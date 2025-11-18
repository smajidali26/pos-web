import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { TopProduct } from '../../../types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopProductsBarChartProps {
  products: TopProduct[];
  title?: string;
  height?: number;
  showQuantity?: boolean;
}

const TopProductsBarChart: React.FC<TopProductsBarChartProps> = ({
  products,
  title = 'Top Products',
  height = 300,
  showQuantity = false,
}) => {
  const chartData = {
    labels: products.map(p => p.productName),
    datasets: [
      {
        label: 'Revenue',
        data: products.map(p => p.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
      ...(showQuantity ? [{
        label: 'Quantity Sold',
        data: products.map(p => p.quantity),
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
        yAxisID: 'y1',
      }] : []),
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            if (label === 'Revenue') {
              return `${label}: $${value.toLocaleString()}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
      ...(showQuantity ? {
        y1: {
          position: 'right' as const,
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
        },
      } : {}),
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TopProductsBarChart;
