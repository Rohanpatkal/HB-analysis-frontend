// app/components/AnalyticsDashboard.jsx
'use client';

import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import LoadingSpinner from './LoadingSpinner';
import KPICards from './KPICards';
import MonthlyBarChart from './MonthlyBarChart';
import YearlyDoughnutChart from './YearlyDoughnutChart';
import TimelineChart from './TimelineChart';

export default function AnalyticsDashboard() {
  const {
    data,
    loading,
    error,
    refetch,
    getAllDailyEvents,
    getMonthlyAggregates,
    getYearlyTotals,
  } = useAnalyticsData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
        <h2>Failed to Load Data</h2>
        <p>{error}</p>
        <button onClick={refetch}>
          <i className="fas fa-redo"></i> Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const dailyEvents = getAllDailyEvents();
  const monthlyAggregates = getMonthlyAggregates();
  const yearlyTotals = getYearlyTotals();

  const insightText = () => {
    const maxMonth = data.AllDetails?.monthMax;
    const maxYear = data.AllDetails?.yearMax;
    const total = data.AllDetails?.totalCount;
    return `📊 Total of ${total} events recorded. Highest activity in ${maxMonth?.month} with ${maxMonth?.count} events, 
    and peak year was ${maxYear?.year} with ${maxYear?.count} events. The timeline shows dynamic fluctuations across the period.`;
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="title-section">
          <h1>
            <i className="fas fa-chart-line" style={{ color: '#3b82f6' }}></i>
            ChronoMetrics · Analytics Engine
          </h1>
          <p>Date-wise event intelligence | Multi-year trends & monthly granularity</p>
        </div>
        <KPICards data={data} />
      </div>

      <div className="chart-grid">
        <MonthlyBarChart monthlyData={monthlyAggregates} />
        <YearlyDoughnutChart yearlyData={yearlyTotals} />
      </div>

      <TimelineChart
        dailyEvents={dailyEvents}
        monthlyAggregates={monthlyAggregates}
        yearlyTotals={yearlyTotals}
      />

      <div className="insight-footer">
        💡 {insightText()}
      </div>
    </div>
  );
}