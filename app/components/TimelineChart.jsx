// app/components/TimelineChart.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';

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

export default function TimelineChart({ dailyEvents, monthlyAggregates, yearlyTotals }) {
  const [granularity, setGranularity] = useState('day');
  const chartRef = useRef(null);

  const getChartData = () => {
    if (granularity === 'day') {
      const labels = dailyEvents.map(event => event.date);
      const counts = dailyEvents.map(event => event.count);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Daily Event Count',
            data: counts,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: 'white',
            pointBorderWidth: 1,
            tension: 0.3,
            fill: true,
          },
        ],
      };
    } else if (granularity === 'month') {
      const labels = monthlyAggregates.map(item => item.month);
      const counts = monthlyAggregates.map(item => item.count);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Monthly Event Count',
            data: counts,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgb(16, 185, 129)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            tension: 0.2,
            fill: true,
          },
        ],
      };
    } else {
      const labels = yearlyTotals.map(item => item.year);
      const counts = yearlyTotals.map(item => item.count);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Yearly Event Count',
            data: counts,
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(249, 115, 22)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            tension: 0.1,
            fill: true,
          },
        ],
      };
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
            return `${context.dataset.label}: ${context.raw}`;
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
          text: granularity === 'day' ? 'Date' : (granularity === 'month' ? 'Month' : 'Year'),
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
    },
  };

  const resetZoom = () => {
    if (chartRef.current && chartRef.current.resetZoom) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className="date-timeline-section">
      <h3>
        <i className="fas fa-calendar-alt" style={{ color: '#3b82f6' }}></i>
        📅 Chronological Timeline
      </h3>
      <div className="timeline-controls">
        <span style={{ fontSize: '0.85rem' }}>Granularity:</span>
        <select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
          <option value="day">Day Level (All Dates)</option>
          <option value="month">Month Aggregation</option>
          <option value="year">Year Aggregation</option>
        </select>
        <button onClick={resetZoom}>
          <i className="fas fa-sync-alt"></i> Reset View
        </button>
      </div>
      <div className="timeline-canvas-wrapper">
        <Line ref={chartRef} options={options} data={getChartData()} />
      </div>
    </div>
  );
}