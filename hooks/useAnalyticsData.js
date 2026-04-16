// hooks/useAnalyticsData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchAnalyticsData } from '@/lib/api-client';

export function useAnalyticsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAnalyticsData();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Helper: Flatten all day entries
  const getAllDailyEvents = useCallback(() => {
    if (!data) return [];

    const dailyPoints = [];
    const years = ['2023', '2024', '2025', '2026'];

    for (const yr of years) {
      const yearObj = data[yr];
      if (!yearObj) continue;

      for (const key in yearObj) {
        if (key.startsWith('array-')) {
          const monthBlock = yearObj[key];
          if (monthBlock && monthBlock.Daydata) {
            for (const dayEntry of monthBlock.Daydata) {
              // Skip invalid entries
              if (dayEntry.day === 'na' || dayEntry.month === 'na' || !dayEntry.year) {
                continue;
              }
              
              const day = parseInt(dayEntry.day, 10);
              const month = parseInt(dayEntry.month, 10);
              const rawCount = parseInt(dayEntry.count, 10);
              
              // Validate month and day ranges
              if (isNaN(day) || isNaN(month) || isNaN(rawCount)) {
                continue;
              }
              if (month < 1 || month > 12 || day < 1 || day > 31) {
                continue;
              }
              if (rawCount <= 0) {
                continue;
              }
              
              const dayStr = day.toString().padStart(2, '0');
              const monthStr = month.toString().padStart(2, '0');
              const isoDate = `${dayEntry.year}-${monthStr}-${dayStr}`;
              dailyPoints.push({ date: isoDate, count: rawCount });
            }
          }
        }
      }
    }

    dailyPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
    return dailyPoints;
  }, [data]);

  // Helper: Get monthly aggregates
  const getMonthlyAggregates = useCallback(() => {
    const dailyEvents = getAllDailyEvents();
    const monthlyMap = new Map();

    for (const event of dailyEvents) {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

      if (monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          ...monthlyMap.get(monthKey),
          count: monthlyMap.get(monthKey).count + event.count,
        });
      } else {
        monthlyMap.set(monthKey, {
          month: monthLabel,
          count: event.count,
          year: date.getFullYear(),
        });
      }
    }

    return Array.from(monthlyMap.values()).sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
    });
  }, [getAllDailyEvents]);

  // Helper: Get yearly totals
  const getYearlyTotals = useCallback(() => {
    if (!data) return [];

    const years = ['2023', '2024', '2025', '2026'];
    return years
      .map(year => {
        const yearData = data[year];
        if (!yearData?.yearDetails?.max?.count) return null;
        return {
          year: year,
          count: yearData.yearDetails.max.count,
        };
      })
      .filter(Boolean);
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch,
    getAllDailyEvents,
    getMonthlyAggregates,
    getYearlyTotals,
  };
}