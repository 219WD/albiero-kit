import { useCallback, useEffect, useState } from 'react';

const PROD_API_BASE = 'https://albi-backend-nine.vercel.app';
const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || '';
const API_BASE =
  !isLocalHost && configuredApiBase.includes('localhost')
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? 'http://localhost:4000' : PROD_API_BASE);

const fetcher = async (endpoint, token) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = new Error(`Error ${res.status} en ${endpoint}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const buildQuery = (range, from, to, filters = {}) => {
  const params = new URLSearchParams({ range });
  if (range === 'custom') {
    params.set('from', from);
    params.set('to', to);
  }
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
};

const useAnalyticsData = (range = '30d', from = '', to = '', token = '', filters = {}) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!token) {
      setSummary(null);
      setLoading(false);
      setError(null);
      setErrorStatus(null);
      return;
    }

    setLoading(true);
    setError(null);
    setErrorStatus(null);

    try {
      const q = buildQuery(range, from, to, filters);
      const data = await fetcher(`/api/analytics/sheet-summary?${q}`, token);
      setSummary(data);
    } catch (err) {
      setError(err.message);
      setErrorStatus(err.status || null);
    } finally {
      setLoading(false);
    }
  }, [range, from, to, token, filters.producto, filters.tipo, filters.ubicacion, filters.sistema]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { summary, loading, error, errorStatus, refetch: fetchAll };
};

export default useAnalyticsData;
