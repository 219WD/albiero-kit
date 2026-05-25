import { useCallback, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:4000';
const API_SECRET = import.meta.env.VITE_ANALYTICS_SECRET || '';

const fetcher = async (endpoint) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${API_SECRET}` },
  });

  if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`);
  return res.json();
};

const buildQuery = (range, from, to) => {
  const params = new URLSearchParams({ range });
  if (range === 'custom') {
    params.set('from', from);
    params.set('to', to);
  }
  return params.toString();
};

const useAnalyticsData = (range = '30d', from = '', to = '') => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const q = buildQuery(range, from, to);
      const data = await fetcher(`/api/analytics/sheet-summary?${q}`);
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [range, from, to]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { summary, loading, error, refetch: fetchAll };
};

export default useAnalyticsData;
