// app/components/YearlyDoughnutChart.jsx
'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function YearlyDoughnutChart({ yearlyData }) {
  if (!yearlyData || yearlyData.length === 0) {
    return <div className="chart-card">No yearly data available</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} events (${percentage}%)`;
          },
        },
      },
    },
  };

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(139, 92, 246, 0.8)',
  ];

  const data = {
    labels: yearlyData.map(item => item.year),
    datasets: [
      {
        data: yearlyData.map(item => item.count),
        backgroundColor: colors,
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>
        <i className="fas fa-chart-pie" style={{ color: '#10b981' }}></i>
        Yearly Distribution & Totals
      </h3>
      <Doughnut options={options} data={data} />
    </div>
  );
}