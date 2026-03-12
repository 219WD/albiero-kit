// hooks/useAnalyticsData.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE   = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:3001';
const API_SECRET = import.meta.env.VITE_ANALYTICS_SECRET  || '';

const fetcher = async (endpoint) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${API_SECRET}` },
  });
  if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`);
  return res.json();
};

const buildQuery = (range, from, to) => {
  const params = new URLSearchParams({ range });
  if (range === 'custom') { params.set('from', from); params.set('to', to); }
  return params.toString();
};

export const formatDate = (dateStr) => {
  const d = dateStr.toString();
  return `${d.slice(6, 8)}/${d.slice(4, 6)}`;
};

const PRODUCTOS = ['KitAlarmaCamara', 'Alarmas', 'Camaras', 'GPS'];

const useAnalyticsData = (range = '30d', from = '', to = '') => {
  const [pageviews,   setPageviews]   = useState([]);
  const [funnel,      setFunnel]      = useState([]);
  const [conversions, setConversions] = useState([]);
  const [abandonment, setAbandonment] = useState({});
  const [breakdown,   setBreakdown]   = useState({ tipo: [], ubicacion: [] });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = buildQuery(range, from, to);

      const [pvData, funnelData, convData, tipoData, ubicData, ...abandonData] =
        await Promise.all([
          fetcher(`/api/analytics/pageviews?${q}`),
          fetcher(`/api/analytics/funnel?${q}`),
          fetcher(`/api/analytics/conversions?${q}`),
          fetcher(`/api/analytics/breakdown/tipo?${q}`),
          fetcher(`/api/analytics/breakdown/ubicacion?${q}`),
          ...PRODUCTOS.map(p => fetcher(`/api/analytics/abandonment?${q}&producto=${p}`)),
        ]);

      setPageviews(pvData.data.map(d => ({ ...d, date: formatDate(d.date) })));
      setFunnel(funnelData.data);
      setConversions(convData.data);
      setBreakdown({ tipo: tipoData.data, ubicacion: ubicData.data });

      const abandonMap = {};
      abandonData.forEach((d, i) => { abandonMap[PRODUCTOS[i]] = d.data; });
      setAbandonment(abandonMap);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [range, from, to]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { pageviews, funnel, conversions, abandonment, breakdown, loading, error, refetch: fetchAll };
};

export default useAnalyticsData;