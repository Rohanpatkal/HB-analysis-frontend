// lib/api-client.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchAnalyticsData() {
  console.log("Starting_fetch_to:", `${API_BASE_URL}/data`);
  try {
    const response = await fetch(`http://localhost:5000/getData`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    console.log("resultyyyyyyyyyyyyyyyyyyyym", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("resultjjjjjjjjjjjjjjjjj",result);

    return result;
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}