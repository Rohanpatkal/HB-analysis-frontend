// app/api/analytics/route.js
import { NextResponse } from 'next/server';

// Replace with your actual backend URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/analytics';

export async function GET(request) {
  try {
    // Fetch data from your backend
    const response = await fetch(BACKEND_API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error fetching from backend:', error);
    
    // Return mock data for development if backend is not available
    if (process.env.NODE_ENV === 'development') {
      const mockData = getMockData();
      return NextResponse.json({
        success: true,
        data: mockData,
        warning: 'Using mock data - backend not available',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Mock data for development (copy your JSON data here)
function getMockData() {
  return {
    "2023": {
      "yearDetails": { "max": { "count": 38, "date": "2023" }, "min": { "count": 38, "date": "2023" } },
      "array-09-2023": {
        "monthDetails": { "count": 12, "month": "09/2023", "year": "2023", "totalDayCount": 5 },
        "Daydata": [
          { "count": "5", "day": "03", "month": "09", "year": "2023", "data": [] },
          { "count": "2", "day": "10", "month": "09", "year": "2023", "data": [] },
          { "count": "2", "day": "13", "month": "09", "year": "2023", "data": [] },
          { "count": "1", "day": "17", "month": "09", "year": "2023", "data": [] },
          { "count": "2", "day": "29", "month": "09", "year": "2023", "data": [] }
        ]
      }
    },
    "2024": {
      "yearDetails": { "max": { "count": 96, "date": "2024" }, "min": { "count": 96, "date": "2024" } }
    },
    "2025": {
      "yearDetails": { "max": { "count": 92, "date": "2025" }, "min": { "count": 92, "date": "2025" } }
    },
    "2026": {
      "yearDetails": { "max": { "count": 42, "date": "2026" }, "min": { "count": 42, "date": "2026" } }
    },
    "AllDetails": {
      "totalCount": 268,
      "yearMax": { "year": "2024", "count": 96 },
      "yearMin": { "year": "2023", "count": 38 },
      "monthMax": { "month": "03/2026", "count": 17 },
      "monthMin": { "month": "07/2025", "count": 4 }
    }
  };
}