import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://data.seattle.gov/resource/kzjm-xkqj.json';
const LIMIT = 500;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useFireIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const fetchIncidents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      // Fetch last 24 hours of incidents, sorted by most recent
      // Socrata SODA uses floating_timestamp format: YYYY-MM-DDTHH:MM:SS (no Z/timezone)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .replace('Z', '')
        .split('.')[0]; // "2026-02-21T13:00:00"

      // Build query string manually — URLSearchParams percent-encodes $ signs
      // which can confuse some Socrata deployments
      const query = [
        `$limit=${LIMIT}`,
        `$order=datetime DESC`,
        `$where=datetime >= '${yesterday}'`,
      ].join('&');

      const res = await fetch(`${API_URL}?${query}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      // Filter to records with valid coordinates
      const valid = data.filter(inc =>
        inc.latitude && inc.longitude &&
        !isNaN(parseFloat(inc.latitude)) &&
        !isNaN(parseFloat(inc.longitude))
      ).map(inc => ({
        ...inc,
        latitude: parseFloat(inc.latitude),
        longitude: parseFloat(inc.longitude),
        id: inc.incident_number || `${inc.latitude}-${inc.longitude}-${inc.datetime}`,
      }));

      setIncidents(valid);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load incidents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents(false);
    intervalRef.current = setInterval(() => fetchIncidents(true), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchIncidents]);

  const refresh = useCallback(() => fetchIncidents(true), [fetchIncidents]);

  return { incidents, loading, error, lastUpdated, refreshing, refresh };
}
