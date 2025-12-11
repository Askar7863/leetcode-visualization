import useSWR from 'swr';
import axios from 'axios';

// In production (Vercel), API is on same domain at /api
// In development, use localhost backend
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001' : ''
);

const fetcher = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

export function useSheetData() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/data`,
    fetcher,
    {
      refreshInterval: 30000, // Auto-refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    data: data?.data || [],
    contestNames: data?.contestNames || [],
    headers: data?.headers || [],
    lastUpdated: data?.lastUpdated,
    totalStudents: data?.totalStudents || 0,
    fromCache: data?.fromCache || false,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

export function useStats() {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/api/stats`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data || {},
    isLoading,
    isError: error,
  };
}
