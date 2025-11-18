import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { ABCProduct } from '../../../types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ABCParetoChartProps {
  products: ABCProduct[];
  title?: string;
  height?: number;
}

const ABCParetoChart: React.FC<ABCParetoChartProps> = ({
  products,
  title = 'ABC Analysis - Pareto Chart',
  height = 400,
}) => {
  // Sort by revenue and take top 20
  const topProducts = [...products]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20);

  const chartData = {
    labels: topProducts.map(p => p.productName),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Revenue',
        data: topProducts.map(p => p.revenue),
        backgroundColor: topProducts.map(p => {
          switch (p.class) {
            case 'A': return 'rgba(75, 192, 192, 0.8)';
            case 'B': return 'rgba(255, 206, 86, 0.8)';
            case 'C': return 'rgba(255, 99, 132, 0.8)';
            default: return 'rgba(201, 203, 207, 0.8)';
          }
        }),
        borderColor: topProducts.map(p => {
          switch (p.class) {
            case 'A': return 'rgb(75, 192, 192)';
            case 'B': return 'rgb(255, 206, 86)';
            case 'C': return 'rgb(255, 99, 132)';
            default: return 'rgb(201, 203, 207)';
          }
        }),
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Cumulative %',
        data: topProducts.map(p => p.cumulativePercentage),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions = {
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
            const value = context.parsed.y;
            if (label === 'Revenue') {
              return `${label}: $${value.toLocaleString()}`;
            }
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default ABCParetoChart;
