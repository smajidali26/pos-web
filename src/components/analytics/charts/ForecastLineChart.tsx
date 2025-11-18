import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ForecastDataPoint } from '../../../types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastLineChartProps {
  data: ForecastDataPoint[];
  title?: string;
  height?: number;
}

const ForecastLineChart: React.FC<ForecastLineChartProps> = ({
  data,
  title = 'Sales Forecast',
  height = 400,
}) => {
  // Separate historical and forecast data
  const historicalData = data.filter(d => d.historical !== undefined);
  const forecastData = data.filter(d => d.predicted !== undefined);

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Historical',
        data: data.map(d => d.historical),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        pointRadius: 2,
      },
      {
        label: 'Predicted',
        data: data.map(d => d.predicted),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 2,
      },
      {
        label: 'Confidence Range',
        data: data.map(d => d.upperBound),
        borderColor: 'transparent',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: '+1',
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: '',
        data: data.map(d => d.lowerBound),
        borderColor: 'transparent',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          filter: (item) => item.text !== '',
        },
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label === '' || label === 'Confidence Range') return '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ForecastLineChart;
