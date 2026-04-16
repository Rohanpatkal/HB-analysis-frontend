// app/components/MonthlyBarChart.jsx
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyBarChart({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) {
    return <div className="chart-card">No monthly data available</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Events: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Event Count',
        },
        grid: {
          color: '#eef2f9',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const data = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Event Volume',
        data: monthlyData.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>
        <i className="fas fa-chart-bar" style={{ color: '#f97316' }}></i>
        Monthly Event Volume (2023–2026)
      </h3>
      <Bar options={options} data={data} />
    </div>
  );
}